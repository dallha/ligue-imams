import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function uploadFileToS3(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.S3_BUCKET_NAME || 'public';
  
  // Clean filename to prevent weird character bugs
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${Date.now()}-${cleanFilename}`;

  if (!url || !serviceRoleKey) {
    throw new Error('Les variables d\'environnement Supabase (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) sont manquantes.');
  }

  const supabase = createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(key, buffer, {
      contentType: mimetype,
      duplex: 'half',
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(key);
  return publicUrl;
}

// Dummy default export to avoid breaking any other file
const dummyS3 = {};
export default dummyS3;
