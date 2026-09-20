let nodemailerModule = null;

/**
 * Dynamically loads nodemailer to ensure compatibility across Vite configs, Vercel serverless, and CLI
 */
async function getNodemailer() {
  if (nodemailerModule) return nodemailerModule;
  try {
    const mod = await import('nodemailer');
    nodemailerModule = mod.default || mod;
    return nodemailerModule;
  } catch (err) {
    try {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      nodemailerModule = require('nodemailer');
      return nodemailerModule;
    } catch (e) {
      throw new Error(`Nodemailer is not available: ${err.message}`);
    }
  }
}

/**
 * Reads email configuration from environment variables.
 * Supports both root .env and runtime process.env
 */
export function getEmailConfig(overrideEnv = {}) {
  const env = { ...process.env, ...overrideEnv };

  const provider = (env.EMAIL_PROVIDER || '').toLowerCase().trim();
  
  // SMTP credentials
  const smtpHost = env.SMTP_HOST || '';
  const smtpPort = parseInt(env.SMTP_PORT || '465', 10);
  const smtpSecure = env.SMTP_SECURE === 'true' || env.SMTP_SECURE === true || smtpPort === 465;
  const smtpUser = env.SMTP_USER || '';
  const smtpPass = env.SMTP_PASS || '';
  const smtpFrom = env.SMTP_FROM || `"NACOS FUTO" <${smtpUser || 'no-reply@nacosfuto.org.ng'}>`;

  // Resend credentials (retained for future / fallback)
  const resendApiKey = env.RESEND_API_KEY || '';
  const resendFrom = env.RESEND_FROM || env.EMAIL_FROM || 'NACOS FUTO <onboarding@resend.dev>';

  // Auto-detect active provider if not explicitly set
  let activeProvider = provider;
  if (!activeProvider) {
    if (smtpHost && smtpUser && smtpPass) {
      activeProvider = 'smtp';
    } else if (resendApiKey) {
      activeProvider = 'resend';
    } else {
      activeProvider = 'simulated';
    }
  }

  return {
    activeProvider,
    smtp: {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      user: smtpUser,
      pass: smtpPass,
      from: smtpFrom,
      isConfigured: Boolean(smtpHost && smtpUser && smtpPass)
    },
    resend: {
      apiKey: resendApiKey,
      from: resendFrom,
      isConfigured: Boolean(resendApiKey)
    }
  };
}

let cachedTransporter = null;
let lastTransporterConfigKey = '';

/**
 * Creates or reuses a Nodemailer transport instance
 */
export async function getSmtpTransporter(smtpConfig) {
  const configKey = `${smtpConfig.host}:${smtpConfig.port}:${smtpConfig.user}:${smtpConfig.secure}`;
  if (cachedTransporter && lastTransporterConfigKey === configKey) {
    return cachedTransporter;
  }

  const nodemailer = await getNodemailer();
  const transportOptions = {
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure, // true for 465, false for 587/STARTTLS
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    },
    tls: {
      rejectUnauthorized: false // Helps avoid self-signed certificate rejections on institutional / university relays
    }
  };

  cachedTransporter = nodemailer.createTransport(transportOptions);
  lastTransporterConfigKey = configKey;
  return cachedTransporter;
}

/**
 * Test SMTP connection and credentials
 */
export async function verifySmtpConnection(overrideEnv = {}) {
  const config = getEmailConfig(overrideEnv);
  if (!config.smtp.isConfigured) {
    return {
      success: false,
      error: 'SMTP is not fully configured. Missing SMTP_HOST, SMTP_USER, or SMTP_PASS.'
    };
  }

  try {
    const transporter = await getSmtpTransporter(config.smtp);
    await transporter.verify();
    return { success: true, message: `SMTP connection to ${config.smtp.host}:${config.smtp.port} verified successfully.` };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to verify SMTP connection.' };
  }
}

/**
 * Send email via Resend API
 */
async function sendViaResend(resendConfig, { to, subject, html, text }) {
  if (!resendConfig.isConfigured) {
    throw new Error('Resend is not configured (missing RESEND_API_KEY).');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendConfig.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: resendConfig.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || undefined,
      text: text || undefined
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Resend API Error (HTTP ${response.status})`);
  }

  return {
    success: true,
    provider: 'resend',
    id: data.id
  };
}

/**
 * Send email via Nodemailer SMTP
 */
async function sendViaSmtp(smtpConfig, { to, subject, html, text }) {
  if (!smtpConfig.isConfigured) {
    throw new Error('SMTP is not fully configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
  }

  const transporter = await getSmtpTransporter(smtpConfig);
  const info = await transporter.sendMail({
    from: smtpConfig.from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    text: text || undefined,
    html: html || undefined
  });

  return {
    success: true,
    provider: 'smtp',
    messageId: info.messageId,
    response: info.response
  };
}

/**
 * Primary dispatch function:
 * 1. Checks configured provider (SMTP or Resend).
 * 2. If SMTP is preferred, sends via Nodemailer.
 *    If SMTP fails and Resend is available, falls back to Resend gracefully.
 * 3. If Resend is preferred, sends via Resend API.
 * 4. If neither is available, simulates and logs to console.
 */
export async function dispatchEmail({ to, subject, html, text }, overrideEnv = {}) {
  const config = getEmailConfig(overrideEnv);
  const targetEmail = Array.isArray(to) ? to.join(', ') : to;

  // Option A: Active provider is SMTP
  if (config.activeProvider === 'smtp' || (config.smtp.isConfigured && config.activeProvider !== 'resend')) {
    try {
      console.log(`\x1b[36m[Email Service: SMTP]\x1b[0m Sending email to: ${targetEmail} (Host: ${config.smtp.host})`);
      const result = await sendViaSmtp(config.smtp, { to, subject, html, text });
      console.log(`\x1b[32m[SMTP Success]\x1b[0m Message ID: ${result.messageId}`);
      return result;
    } catch (smtpErr) {
      console.error(`\x1b[31m[SMTP Error]\x1b[0m ${smtpErr.message}`);
      
      // Automatic fallback to Resend if available
      if (config.resend.isConfigured) {
        console.warn('\x1b[33m[Email Fallback]\x1b[0m Attempting fallback to Resend...');
        try {
          const resendResult = await sendViaResend(config.resend, { to, subject, html, text });
          console.log(`\x1b[32m[Resend Fallback Success]\x1b[0m ID: ${resendResult.id}`);
          return { ...resendResult, fallbackFrom: 'smtp', smtpError: smtpErr.message };
        } catch (resendErr) {
          console.error(`\x1b[31m[Resend Fallback Error]\x1b[0m ${resendErr.message}`);
        }
      }

      throw smtpErr;
    }
  }

  // Option B: Active provider is Resend
  if (config.activeProvider === 'resend' || config.resend.isConfigured) {
    try {
      console.log(`\x1b[36m[Email Service: Resend]\x1b[0m Sending email to: ${targetEmail}`);
      const result = await sendViaResend(config.resend, { to, subject, html, text });
      console.log(`\x1b[32m[Resend Success]\x1b[0m Email ID: ${result.id}`);
      return result;
    } catch (resendErr) {
      console.error(`\x1b[31m[Resend Error]\x1b[0m ${resendErr.message}`);

      // Fallback to SMTP if configured
      if (config.smtp.isConfigured) {
        console.warn('\x1b[33m[Email Fallback]\x1b[0m Attempting fallback to SMTP...');
        try {
          const smtpResult = await sendViaSmtp(config.smtp, { to, subject, html, text });
          return { ...smtpResult, fallbackFrom: 'resend', resendError: resendErr.message };
        } catch (smtpErr) {
          console.error(`\x1b[31m[SMTP Fallback Error]\x1b[0m ${smtpErr.message}`);
        }
      }

      throw resendErr;
    }
  }

  // Option C: Simulation / Development mode
  console.warn('\x1b[33m[Email DEV Mode]\x1b[0m No active SMTP or Resend credentials found. Simulating email:');
  console.info(`\x1b[33m[Simulated Email to]\x1b[0m: ${targetEmail}`);
  console.info(`\x1b[33m[Subject]\x1b[0m: ${subject}`);
  if (text) console.info(`\x1b[33m[Body]\x1b[0m:\n${text}`);

  return {
    success: true,
    provider: 'simulated',
    simulated: true,
    to: targetEmail,
    message: 'Email simulated in development mode (credentials not configured).'
  };
}
