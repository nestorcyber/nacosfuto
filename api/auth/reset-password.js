import { createClient } from '@supabase/supabase-js';

/**
 * Serverless API: /api/auth/reset-password
 * 
 * Safely updates student password_hash in Supabase profiles.
 * If SUPABASE_SERVICE_ROLE_KEY is present in server environment, uses service_role
 * to bypass RLS; otherwise uses anon key.
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

  const { identifier, newPasswordHash } = req.body || {};

  if (!identifier || !newPasswordHash) {
    return res.status(400).json({ error: 'Missing required parameters: identifier and newPasswordHash.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hfaomycwsjgxgvdqqgwl.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase server configuration is missing.' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const cleanId = identifier.trim();

    // 1. Find the student in profiles table by registration_number or email
    const { data: existing, error: findError } = await supabase
      .from('profiles')
      .select('id, registration_number, email')
      .or(`registration_number.ilike.${cleanId},email.ilike.${cleanId}`)
      .limit(1)
      .maybeSingle();

    if (findError) {
      console.error('[Reset Password API] Profile find error:', findError);
      return res.status(500).json({ error: findError.message });
    }

    if (!existing) {
      return res.status(404).json({ error: 'No student profile found with those details.' });
    }

    // 2. Update password_hash in profiles
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select();

    if (updateError) {
      console.error('[Reset Password API] Update error:', updateError);
      return res.status(500).json({ error: updateError.message, code: updateError.code });
    }

    if (!updated || updated.length === 0) {
      return res.status(400).json({ error: 'Could not update password. Row level security policy may be blocking updates.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password successfully updated in database.',
      registration_number: existing.registration_number
    });
  } catch (err) {
    console.error('[Reset Password API] Unexpected error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
