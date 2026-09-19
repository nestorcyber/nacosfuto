/**
 * NACOS FUTO SMS Service Abstraction (Zero-Serverless Termii Client)
 * 
 * Directly dispatches verification SMS via Termii API (https://api.termii.com)
 * without requiring any Vercel/backend serverless functions.
 * 
 * Environment Variables (in .env):
 *   VITE_TERMII_API_KEY   - Termii secret API key
 *   VITE_TERMII_SENDER_ID - Approved Sender ID (e.g. "N-Alert" or "NACOS")
 *   VITE_TERMII_CHANNEL   - Route channel: "dnd" (default) or "generic"
 */

const TERMII_API_KEY = typeof import.meta !== 'undefined' && import.meta.env?.VITE_TERMII_API_KEY
  ? import.meta.env.VITE_TERMII_API_KEY
  : (typeof process !== 'undefined' && process.env?.TERMII_API_KEY ? process.env.TERMII_API_KEY : '');

const TERMII_SENDER_ID = typeof import.meta !== 'undefined' && import.meta.env?.VITE_TERMII_SENDER_ID
  ? import.meta.env.VITE_TERMII_SENDER_ID
  : (typeof process !== 'undefined' && process.env?.TERMII_SENDER_ID ? process.env.TERMII_SENDER_ID : 'N-Alert');

const TERMII_CHANNEL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_TERMII_CHANNEL
  ? import.meta.env.VITE_TERMII_CHANNEL
  : (typeof process !== 'undefined' && process.env?.TERMII_CHANNEL ? process.env.TERMII_CHANNEL : 'dnd');

/**
 * Normalize Nigerian mobile number for Termii
 * e.g., 08012345678 -> 2348012345678
 */
function normalizeToTermii(phone) {
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

/**
 * Build verification SMS message text
 */
function buildVerificationSMSText(code, expiryMinutes = 5) {
  return `NACOS FUTO: Your student verification code is ${code}. Valid for ${expiryMinutes} minutes. Never disclose this code to anyone.`;
}

/**
 * Dispatch verification SMS via Termii directly (Zero-Serverless)
 */
export async function sendVerificationSMS(toPhone, otpCode) {
  const expiryMinutes = 5;
  const message = buildVerificationSMSText(otpCode, expiryMinutes);
  const termiiNumber = normalizeToTermii(toPhone);

  console.info(`[Termii SMS] Verification OTP for ${termiiNumber}: ${otpCode}`);

  // If live Termii API key is configured, perform direct dispatch
  if (TERMII_API_KEY) {
    try {
      const response = await fetch('https://api.termii.com/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          api_key: TERMII_API_KEY,
          to: termiiNumber,
          from: TERMII_SENDER_ID,
          sms: message,
          type: 'plain',
          channel: TERMII_CHANNEL
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || (data.code && data.code !== 'ok' && !data.message_id)) {
        console.error('[Termii SMS API Error]', data);
        return {
          success: false,
          error: { message: data.message || 'Failed to dispatch verification SMS via Termii.' }
        };
      }

      console.info(`[Termii SMS Success] Dispatched SMS to ${termiiNumber} (Message ID: ${data.message_id || 'ok'})`);
      return { success: true, provider: 'termii', messageId: data.message_id };
    } catch (err) {
      console.warn('[Termii SMS Direct Network Error]', err);
    }
  }

  // Resilient Development / Simulated Fallback
  console.info(`%c[NACOS VERIFICATION CODE (TERMII)]: ${otpCode} for ${termiiNumber}`, 'background: #083002; color: #4ade80; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
  return {
    success: true,
    provider: 'simulated_termii',
    message: 'Verification code logged to console.'
  };
}
