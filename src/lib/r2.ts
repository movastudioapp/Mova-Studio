import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const endpoint = import.meta.env.VITE_R2_ENDPOINT;
const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;

let s3Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!s3Client) {
    if (!accessKeyId || !secretAccessKey || !endpoint) {
      throw new Error("R2 credentials not provided in environment variables");
    }
    s3Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3Client;
}

export async function uploadToR2(file: File | Blob, key: string): Promise<string> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: file.type || "application/octet-stream",
  });

  await client.send(command);
  
  // Construct the public URL if using a custom domain or standard R2 URL
  // Or return the key for presigned access
  return `${endpoint}/${bucketName}/${key}`;
}

export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
}
