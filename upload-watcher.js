import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import mime from 'mime';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';



// Configurare variabile de mediu
dotenv.config();

// Fix pentru __dirname în ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calea către fișierele statice (ex: public)
const directoryPath = path.join(__dirname, 'fornt-end/public');

// Inițializare client S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Extensii de imagini care vor fi convertite în WebP
const imageExtensions = ['.jpg', '.jpeg', '.png'];

/**
 * ✅ Upload un singur fișier către S3
 */
async function uploadFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const relativePath = path.relative(directoryPath, filePath).replace(/\\/g, '/');

  let fileContent;
  let contentType = mime.getType(filePath) || 'application/octet-stream';
  let uploadKey = relativePath;

  try {
    if (imageExtensions.includes(ext)) {
      const webpBuffer = await sharp(filePath).webp({ quality: 80 }).toBuffer();
      fileContent = webpBuffer;
      contentType = 'image/webp';
      uploadKey = uploadKey.replace(ext, '.webp');
      console.log(`🔄 Convertit ${relativePath} în WebP`);
    } else {
      fileContent = await fs.readFile(filePath);
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uploadKey,
      Body: fileContent,
      ContentType: contentType,
    });

    await s3.send(command);
    console.log(`✅ Uploaded: ${uploadKey}`);
  } catch (error) {
    console.error(`❌ Eroare la upload pentru ${uploadKey}:`, error);
  }
}


async function uploadDirectory(dir) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await uploadDirectory(filePath);
    } else {
      await uploadFile(filePath);
    }
  }
}

uploadDirectory(directoryPath)
  .then(() => console.log('🎉 Toate fișierele statice au fost urcate în S3 și convertite unde a fost cazul!'))
  .catch((err) => {
    console.error('❌ Eroare generală:', err);
    process.exit(1);
  });

const watcher = chokidar.watch(directoryPath, {
  ignored: /^\./,
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', (filePath) => {
    console.log(`📥 Fișier nou detectat: ${filePath}`);
    uploadFile(filePath);
  })
  .on('change', (filePath) => {
    console.log(`✏️ Fișier modificat detectat: ${filePath}`);
    uploadFile(filePath);
  })
  .on('unlink', (filePath) => {
    console.log(`🗑️ Fișier șters local: ${filePath} (opțional: poți implementa delete din S3 aici)`);
  });
