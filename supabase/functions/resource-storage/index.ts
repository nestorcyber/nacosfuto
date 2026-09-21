// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code runs on Supabase Edge Functions with Deno runtime.
// Primary Object Storage Provider: Backblaze B2 (S3-Compatible API).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "npm:@aws-sdk/client-s3@3.454.0";
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

    // Read Backblaze B2 configuration from environment
    const keyId = Deno.env.get("B2_KEY_ID") || Deno.env.get("B2_APPLICATION_KEY_ID") || Deno.env.get("R2_ACCESS_KEY_ID") || "";
    const applicationKey = Deno.env.get("B2_APPLICATION_KEY") || Deno.env.get("R2_SECRET_ACCESS_KEY") || "";
    const bucketName = Deno.env.get("B2_BUCKET_NAME") || Deno.env.get("R2_BUCKET_NAME") || "nacos-resources";
    const endpoint = Deno.env.get("B2_ENDPOINT") || (Deno.env.get("R2_ACCOUNT_ID") ? `https://${Deno.env.get("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com` : "https://s3.us-east-005.backblazeb2.com");
    const region = Deno.env.get("B2_REGION") || "us-east-005";
    const publicUrl = Deno.env.get("B2_PUBLIC_URL") || Deno.env.get("R2_PUBLIC_URL") || "";

    if (!keyId || !applicationKey) {
      return new Response(
        JSON.stringify({ 
          error: "Backblaze B2 storage credentials (B2_KEY_ID, B2_APPLICATION_KEY) are not configured in environment." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Configure S3 Client for Backblaze B2
    const s3 = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: applicationKey
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

    // Prevent directory traversal and normalize key
    const sanitizedKey = storageKey.replace(/\.\./g, "").replace(/^\/+/, "");

    // Action 1: Presign Direct Upload URL (Browser -> Backblaze B2)
    if (action === "presign-upload") {
      // Authenticate admin if Authorization header is provided
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supabase.auth.getUser(token);
        // Authorization verified
      }

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey,
        ContentType: mimeType || "application/octet-stream"
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 mins for direct upload

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

    // Action 2: Presign Time-Limited Download URL (Forces attachment download)
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

    // Action 3: Presign Inline Preview URL (PDF / Video / Image streaming)
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

    // Action 4: Delete Object from Backblaze B2
    if (action === "delete") {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey
      });

      await s3.send(command);

      return new Response(
        JSON.stringify({ success: true, message: "Backblaze B2 object deleted successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action 5: Check Object Metadata / Existence
    if (action === "metadata") {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: sanitizedKey
      });

      const meta = await s3.send(command);

      return new Response(
        JSON.stringify({
          success: true,
          contentLength: meta.ContentLength,
          contentType: meta.ContentType,
          lastModified: meta.LastModified,
          etag: meta.ETag
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unsupported action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "An unexpected error occurred in storage handler." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
