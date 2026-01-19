/**
 * Image Compression and Vercel Blob Migration Script
 *
 * This script:
 * 1. Finds all images (jpg, jpeg, png, gif) in ./media folder
 * 2. Compresses and converts them to WebP format using sharp
 * 3. Uploads the new images to Vercel Blob
 * 4. Optionally deletes the old local images
 *
 * Usage:
 *   npx ts-node scripts/compress-and-upload-images.ts
 *
 * Environment Variables Required:
 *   BLOB_READ_WRITE_TOKEN - Vercel Blob token
 */

import { del, list, put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

// Configuration
const MEDIA_DIR = path.join(process.cwd(), 'media');
const OUTPUT_DIR = path.join(process.cwd(), 'media-compressed');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

// Compression settings
const WEBP_QUALITY = 80; // 0-100, lower = smaller file
const MAX_WIDTH = 1920; // Max width for images
const MAX_HEIGHT = 1080; // Max height for images

interface ImageStats {
  originalPath: string;
  originalSize: number;
  compressedPath: string;
  compressedSize: number;
  blobUrl?: string;
  compressionRatio: number;
}

async function findImages(dir: string): Promise<string[]> {
  const images: string[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      images.push(...(await findImages(fullPath)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

async function compressImage(
  inputPath: string,
  outputPath: string
): Promise<{ originalSize: number; compressedSize: number }> {
  const originalSize = fs.statSync(inputPath).size;

  // Read and process image
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Resize if larger than max dimensions while maintaining aspect ratio
  let pipeline = image;
  if (metadata.width && metadata.height) {
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
  }

  // Convert to WebP with compression
  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  return { originalSize, compressedSize };
}

async function uploadToVercelBlob(
  filePath: string,
  blobPath: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);

  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    contentType: 'image/webp',
  });

  return blob.url;
}

async function deleteExistingBlob(blobPath: string): Promise<void> {
  try {
    // List blobs to find the one to delete
    const { blobs } = await list({ prefix: blobPath });
    for (const blob of blobs) {
      await del(blob.url);
    }
  } catch (error) {
    // Blob might not exist, that's ok
  }
}

async function main() {

  // Check for environment variable
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      '❌ Error: BLOB_READ_WRITE_TOKEN environment variable is required'
    );
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Find all images
  const images = await findImages(MEDIA_DIR);

  if (images.length === 0) {
    console.log('No images found. Exiting.');
    return;
  }

  const stats: ImageStats[] = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  // Process each image
  for (let i = 0; i < images.length; i++) {
    const imagePath = images[i];
    const relativePath = path.relative(MEDIA_DIR, imagePath);
    const baseName = path.basename(imagePath, path.extname(imagePath));
    const outputFileName = `${baseName}.webp`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);
    const blobPath = `media/${outputFileName}`;


    try {
      // Compress image
      const { originalSize, compressedSize } = await compressImage(
        imagePath,
        outputPath
      );
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;

      const compressionRatio = (
        (1 - compressedSize / originalSize) *
        100
      ).toFixed(1);

      // Upload to Vercel Blob
      const blobUrl = await uploadToVercelBlob(outputPath, blobPath);

      stats.push({
        originalPath: relativePath,
        originalSize,
        compressedPath: outputFileName,
        compressedSize,
        blobUrl,
        compressionRatio: parseFloat(compressionRatio),
      });
    } catch (error) {
      console.error(`   ❌ Error processing ${relativePath}:`, error);
    }

  }

  // Save mapping file for reference
  const mappingPath = path.join(OUTPUT_DIR, 'image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(stats, null, 2));
}

main().catch(console.error);
