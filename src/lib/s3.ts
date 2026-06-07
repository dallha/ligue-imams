import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT, // e.g. https://<project-ref>.supabase.co/storage/v1/s3
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true, // Required for some S3 compatible services like Supabase
});

export async function uploadFileToS3(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  const bucket = process.env.S3_BUCKET_NAME || 'public';
  const key = `${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read' as ObjectCannedACL,
  });

  await s3Client.send(command);

  // Return the public URL
  // If using Supabase Storage, the public URL is usually predictable.
  // We can construct it based on the endpoint, bucket, and key.
  const endpointUrl = new URL(process.env.S3_ENDPOINT || '');
  // For supabase: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<key>
  if (endpointUrl.hostname.includes('supabase')) {
    return `${endpointUrl.origin}/storage/v1/object/public/${bucket}/${key}`;
  }
  
  // Standard S3 compatible URL (path style)
  return `${process.env.S3_ENDPOINT}/${bucket}/${key}`;
}

export default s3Client;
