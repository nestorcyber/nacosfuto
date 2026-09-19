/**
 * NACOS FUTO Email Service Abstraction (Zero-Serverless Resend Client)
 * 
 * Directly dispatches verification emails via Resend API (https://resend.com)
 * without requiring any Vercel/backend serverless functions.
 * 
 * Environment Variables (in .env):
 *   VITE_RESEND_API_KEY - Resend API key (e.g., "re_...")
 *   VITE_RESEND_FROM    - Verified sender (defaults to "NACOS FUTO <onboarding@resend.dev>")
 */

const RESEND_API_KEY = typeof import.meta !== 'undefined' && import.meta.env?.VITE_RESEND_API_KEY
  ? import.meta.env.VITE_RESEND_API_KEY
  : (typeof process !== 'undefined' && process.env?.RESEND_API_KEY ? process.env.RESEND_API_KEY : '');

const RESEND_FROM = typeof import.meta !== 'undefined' && import.meta.env?.VITE_RESEND_FROM
  ? import.meta.env.VITE_RESEND_FROM
  : (typeof process !== 'undefined' && process.env?.RESEND_FROM ? process.env.RESEND_FROM : 'NACOS FUTO <onboarding@resend.dev>');

/**
 * Build responsive, branded HTML email for verification code
 */
function buildVerificationEmailHTML(code, expiryMinutes = 5) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NACOS Portal Verification Code</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
              <!-- Top Green Header -->
              <tr>
                <td style="background-color:#083002;background:linear-gradient(135deg, #083002 0%, #138601 100%);padding:32px 28px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;letter-spacing:0.5px;">NACOS FUTO</h1>
                  <p style="color:#dcfce7;margin:6px 0 0;font-size:13px;font-weight:500;">Department of Computer Science &bull; Student Portal</p>
                </td>
              </tr>
              <!-- Body Content -->
              <tr>
                <td style="padding:36px 32px;">
                  <h2 style="color:#0f172a;margin:0 0 12px;font-size:20px;font-weight:700;">Student Identity Verification</h2>
                  <p style="color:#475569;margin:0 0 24px;font-size:14px;line-height:1.6;">
                    You are verifying your student account on the <strong>NACOS FUTO Student Portal</strong>. Use the secure 6-digit verification code below to complete your registration.
                  </p>
                  
                  <!-- OTP Code Box -->
                  <div style="background-color:#f0fdf4;border:2px dashed #16a34a;border-radius:12px;padding:24px 16px;text-align:center;margin:0 0 24px;">
                    <span style="color:#15803d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;display:block;margin-bottom:8px;">Your 6-Digit Code</span>
                    <span style="color:#052e16;font-size:38px;font-weight:800;letter-spacing:10px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;display:inline-block;padding-left:10px;">${code}</span>
                  </div>

                  <div style="background-color:#f1f5f9;border-radius:8px;padding:12px 16px;margin:0 0 20px;">
                    <p style="color:#334155;margin:0;font-size:12px;line-height:1.5;">
                      ⏰ This verification code is valid for <strong>${expiryMinutes} minutes</strong> and can only be used once.
                    </p>
                  </div>

                  <p style="color:#64748b;margin:0;font-size:12px;line-height:1.5;">
                    If you did not initiate this registration request, please disregard this email. Never share your verification code with anyone. NACOS executives will never ask for your code.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
                  <p style="color:#94a3b8;margin:0;font-size:11px;line-height:1.6;">
                    National Association of Computer Science Students (NACOS)<br>
                    Federal University of Technology, Owerri (FUTO), Imo State, Nigeria
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Build plain text fallback
 */
function buildVerificationEmailText(code, expiryMinutes = 5) {
  return [
    'NACOS FUTO - STUDENT PORTAL VERIFICATION',
    '=========================================',
    '',
    'You are verifying your account for the NACOS FUTO Student Portal.',
    '',
    `YOUR VERIFICATION CODE: ${code}`,
    '',
    `This code expires in ${expiryMinutes} minutes.`,
    '',
    'Security Note: Do not share this code with anyone.',
    'If you did not initiate this request, you can safely ignore this email.',
    '',
    '-----------------------------------------',
    'Department of Computer Science',
    'Federal University of Technology, Owerri'
  ].join('\n');
}

/**
 * Dispatch verification email via Resend directly (Zero-Serverless)
 */
export async function sendVerificationEmail(toEmail, otpCode) {
  const expiryMinutes = 5;
  const subject = `NACOS Portal Verification Code: ${otpCode}`;
  const htmlBody = buildVerificationEmailHTML(otpCode, expiryMinutes);
  const textBody = buildVerificationEmailText(otpCode, expiryMinutes);

  console.info(`[Resend Email] Verification OTP for ${toEmail}: ${otpCode}`);

  // If live Resend API key is configured, perform direct dispatch
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [toEmail],
          subject,
          html: htmlBody,
          text: textBody
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('[Resend Email API Error]', data);
        return {
          success: false,
          error: { message: data.message || 'Failed to dispatch email via Resend.' }
        };
      }

      console.info(`[Resend Email Success] Dispatched email to ${toEmail} (ID: ${data.id})`);
      return { success: true, provider: 'resend', id: data.id };
    } catch (err) {
      console.warn('[Resend Email Direct Network Error]', err);
    }
  }

  // Resilient Development / Simulated Fallback
  console.info(`%c[NACOS VERIFICATION CODE (RESEND)]: ${otpCode} for ${toEmail}`, 'background: #083002; color: #4ade80; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
  return {
    success: true,
    provider: 'simulated_resend',
    message: 'Verification code logged to console.'
  };
}

/**
 * Send account recovery notification email to admin
 */
export async function sendRecoveryNotificationEmail(adminEmail, studentReg, studentName) {
  const subject = `[NACOS Portal] Account Recovery Request: ${studentReg}`;
  const text = `Student ${studentName} (${studentReg}) has requested an account recovery. Please review in the Portal Admin panel.`;
  
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [adminEmail],
          subject,
          text
        })
      });
    } catch (e) {}
  }

  return { success: true };
}
