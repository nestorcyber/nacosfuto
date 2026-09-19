/**
 * Vercel Serverless Function: Send Verification SMS via Termii
 * 
 * Secure API endpoint for sending SMS verification codes to students.
 * Keeps Termii API credentials strictly server-side.
 * 
 * Environment Variables:
 *   TERMII_API_KEY     - Secret API key from https://termii.com
 *   TERMII_SENDER_ID   - Approved Sender ID (e.g., "NACOS" or Termii default "N-Alert")
 *   TERMII_CHANNEL     - Route channel: "dnd" (recommended for OTPs in Nigeria) or "generic"
 *   SMS_PROVIDER       - "termii" (default) or "simulated"
 */

/**
 * Format Nigerian phone number specifically for Termii API
 * e.g., "08012345678" -> "2348012345678"
 * e.g., "+2348012345678" -> "2348012345678"
 */
function normalizeToTermiiNumber(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1);
  }
  if (digits.startsWith('234') && digits.length === 13) {
    return digits;
  }
  if (digits.length === 10) {
    return '234' + digits;
  }
  return digits;
}

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

  const { to, message } = req.body || {};

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required parameters: "to" and "message".' });
  }

  const termiiNumber = normalizeToTermiiNumber(to);
  if (!termiiNumber || termiiNumber.length < 11) {
    return res.status(400).json({ error: 'Invalid recipient phone number. Expected Nigerian mobile number.' });
  }

  const apiKey = process.env.TERMII_API_KEY;
  const senderId = process.env.TERMII_SENDER_ID || 'N-Alert';
  const channel = process.env.TERMII_CHANNEL || 'dnd'; // 'dnd' ensures delivery to DND-registered lines

  // If no API key configured, safely simulate in development mode
  if (!apiKey) {
    console.warn('[Termii SMS DEV] TERMII_API_KEY is not configured.');
    console.info(`[Termii SMS DEV] Simulated SMS to ${termiiNumber}: "${message}"`);
    return res.status(200).json({
      success: true,
      provider: 'simulated_termii',
      to: termiiNumber,
      message: 'TERMII_API_KEY not configured. Verification code logged to server console.'
    });
  }

  try {
    const payload = {
      api_key: apiKey,
      to: termiiNumber,
      from: senderId,
      sms: message,
      type: 'plain',
      channel
    };

    const response = await fetch('https://api.termii.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[Termii SMS API] HTTP Error:', response.status, data);
      return res.status(response.status).json({
        error: data.message || 'Failed to dispatch SMS via Termii.',
        details: data
      });
    }

    // Termii API error statuses often returned inside 200 payload
    if (data.code && data.code !== 'ok' && !data.message_id) {
      console.error('[Termii SMS API] Termii Error response:', data);
      return res.status(400).json({
        error: data.message || 'Termii rejected SMS dispatch.',
        details: data
      });
    }

    console.info(`[Termii SMS API] Verification SMS successfully sent to ${termiiNumber} (Message ID: ${data.message_id || 'ok'})`);

    return res.status(200).json({
      success: true,
      provider: 'termii',
      messageId: data.message_id,
      balance: data.balance
    });
  } catch (err) {
    console.error('[Termii SMS API] Unexpected Network Exception:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Termii SMS Gateway. Please try again later.'
    });
  }
}
