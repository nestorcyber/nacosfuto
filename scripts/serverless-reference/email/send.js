/**
 * Vercel Serverless Function: Send Verification Email via Resend
 * 
 * Secure API endpoint for sending verification codes and notifications to students.
 * Keeps Resend API credentials strictly server-side.
 * 
 * Environment Variables:
 *   RESEND_API_KEY  - Secret API key from https://resend.com (starts with "re_")
 *   RESEND_FROM     - Verified sender email (e.g. "NACOS FUTO <onboarding@resend.dev>" or "NACOS FUTO <noreply@nacosfuto.org.ng>")
 *   EMAIL_FROM      - Fallback sender email address
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { to, subject, html, text } = req.body || {};

  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({ error: 'Missing required parameters: "to", "subject", and ("html" or "text").' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || process.env.EMAIL_FROM || 'NACOS FUTO <onboarding@resend.dev>';

  // If no API key configured, safely simulate in development mode
  if (!apiKey) {
    console.warn('[Resend Email DEV] RESEND_API_KEY is not configured.');
    console.info(`[Resend Email DEV] Simulated Email to: ${to} | Subject: "${subject}"`);
    return res.status(200).json({
      success: true,
      provider: 'simulated_resend',
      to,
      message: 'RESEND_API_KEY not configured. Verification email logged to server console.'
    });
  }

  try {
    const payload = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || undefined,
      text: text || undefined
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[Resend Email API] HTTP Error:', response.status, data);
      return res.status(response.status).json({
        error: data.message || 'Failed to dispatch email via Resend.',
        details: data
      });
    }

    console.info(`[Resend Email API] Verification email sent to ${to} (ID: ${data.id})`);

    return res.status(200).json({
      success: true,
      provider: 'resend',
      id: data.id
    });
  } catch (err) {
    console.error('[Resend Email API] Unexpected Network Exception:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Resend Email API. Please try again later.'
    });
  }
}
