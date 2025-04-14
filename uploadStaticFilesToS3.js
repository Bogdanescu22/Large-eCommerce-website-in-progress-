import fs from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Reparăm __dirname în ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setăm calea către folderul cu fișiere statice (ex: public)
const directoryPath = path.join(__dirname, 'public');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadDirectory(dir) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await uploadDirectory(filePath);
    } else {
      const fileContent = await fs.readFile(filePath);
      const contentType = mime.getType(filePath) || 'application/octet-stream';
      const s3Key = path.relative(directoryPath, filePath).replace(/\\/g, '/');

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await s3.send(command);
      console.log(`✅ Uploaded: ${s3Key}`);
    }
  }
}

uploadDirectory(directoryPath)
  .then(() => console.log("🎉 Toate fișierele statice au fost urcate în S3!"))
  .catch(console.error);
