import { dispatchEmail } from '../../packages/supabase/src/server/emailDispatcher.js';

/**
 * Serverless API Endpoint: /api/email/send
 * 
 * Supports both Nodemailer SMTP and Resend (with automatic fallback).
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { to, subject, html, text } = req.body || {};

  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({
      error: 'Missing required parameters: "to", "subject", and ("html" or "text").'
    });
  }

  try {
    const result = await dispatchEmail({ to, subject, html, text });
    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/email/send Error]:', err);
    return res.status(500).json({
      error: err.message || 'Failed to dispatch email.',
      details: err.stack
    });
  }
}
