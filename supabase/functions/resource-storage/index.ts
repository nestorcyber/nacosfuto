// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code is running on Supabase Edge Functions with Deno runtime.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "npm:@aws-sdk/client-s3@3.454.0";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.454.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Read R2 configuration from environment
    const accountId = Deno.env.get("R2_ACCOUNT_ID") || "";
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID") || "";
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY") || "";
    const bucketName = Deno.env.get("R2_BUCKET_NAME") || "nacos-resources";
    const publicUrl = Deno.env.get("R2_PUBLIC_URL") || "";

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return new Response(
        JSON.stringify({ 
          error: "Cloudflare R2 storage credentials are not configured in environment." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Configure S3 Client for Cloudflare R2
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    const body = await req.json();
    const { action, storageKey, mimeType, downloadFileName, expiresInSeconds = 3600 } = body;

    if (!storageKey) {
      return new Response(
        JSON.stringify({ error: "storageKey is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prevent directory traversal
    const sanitizedKey = storageKey.replace(/\.\./g, "").replace(/^\/+/, "");

    // Handle Actions
    if (action === "presign-upload") {
      // Optional: Verify admin auth header if required
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
        // User check can be verified against admin_users
      }

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey,
        ContentType: mimeType || "application/octet-stream"
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 mins for upload

      return new Response(
        JSON.stringify({
          success: true,
          uploadUrl,
          storageKey: sanitizedKey,
          bucket: bucketName,
          publicUrl: publicUrl ? `${publicUrl}/${sanitizedKey}` : undefined
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "presign-download") {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey,
        ResponseContentDisposition: downloadFileName ? `attachment; filename="${downloadFileName}"` : undefined
      });

      const downloadUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

      return new Response(
        JSON.stringify({
          success: true,
          downloadUrl,
          expiresIn: expiresInSeconds
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "presign-preview") {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey,
        ResponseContentDisposition: "inline"
      });

      const previewUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

      return new Response(
        JSON.stringify({
          success: true,
          previewUrl
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete") {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey
      });

      await s3.send(command);

      return new Response(
        JSON.stringify({ success: true, message: "Object deleted successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unsupported action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
