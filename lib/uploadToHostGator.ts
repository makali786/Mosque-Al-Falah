/**
 * HostGator FTP Upload Utility
 *
 * This utility provides functions to upload files to HostGator via FTP.
 * It handles connection, upload, and error management.
 */

import { Client } from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';

// HostGator FTP Configuration
const FTP_CONFIG = {
  host: process.env.HOSTGATOR_FTP_HOST || 'ftp.blusynergygroup.com',
  user: process.env.HOSTGATOR_FTP_USER || 'masjidapp@masjid-alfalah.org.uk',
  password: process.env.HOSTGATOR_FTP_PASSWORD || 'm@sjid786',
  port: parseInt(process.env.HOSTGATOR_FTP_PORT || '21'),
  secure: false, // Use explicit FTPS if needed
};

const REMOTE_MEDIA_DIR = '/public_html/uploads/media';
const PUBLIC_MEDIA_URL = 'https://masjid-alfalah.org.uk/uploads/media';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to HostGator FTP server
 * @param localFilePath - Path to the local file to upload
 * @param remoteFileName - Name for the file on the server
 * @returns Promise with upload result
 */
export async function uploadToHostGator(
  localFilePath: string,
  remoteFileName?: string
): Promise<UploadResult> {
  const client = new Client();

  try {
    // Connect to FTP server
    await client.access(FTP_CONFIG);
    console.log(`✅ Connected to ${FTP_CONFIG.host}`);

    // Ensure remote media directory exists
    try {
      await client.ensureDir(REMOTE_MEDIA_DIR);
      console.log(`✅ Directory ensured: ${REMOTE_MEDIA_DIR}`);
    } catch (error) {
      console.log(`ℹ️  Directory might already exist: ${REMOTE_MEDIA_DIR}`);
    }

    // Navigate to media directory
    await client.cd(REMOTE_MEDIA_DIR);
    console.log(`✅ Changed to directory: ${REMOTE_MEDIA_DIR}`);

    // Determine remote filename
    const fileName = remoteFileName || path.basename(localFilePath);

    // Upload the file
    await client.uploadFrom(localFilePath, fileName);
    console.log(`✅ Uploaded: ${fileName}`);

    // Construct public URL
    const publicUrl = `${PUBLIC_MEDIA_URL}/${encodeURIComponent(fileName)}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('❌ FTP Upload Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    client.close();
  }
}

/**
 * Upload a buffer (file data) to HostGator FTP server
 * @param fileBuffer - Buffer containing file data
 * @param fileName - Name for the file on the server
 * @returns Promise with upload result
 */
export async function uploadBufferToHostGator(
  fileBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  const client = new Client();

  try {
    // Connect to FTP server
    await client.access(FTP_CONFIG);
    console.log(`✅ Connected to ${FTP_CONFIG.host}`);

    // Ensure remote media directory exists
    try {
      await client.ensureDir(REMOTE_MEDIA_DIR);
    } catch (error) {
      // Directory might already exist
    }

    // Navigate to media directory
    await client.cd(REMOTE_MEDIA_DIR);

    // Create temporary file from buffer
    const tempFilePath = `/tmp/${fileName}`;
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Upload the file
    await client.uploadFrom(tempFilePath, fileName);
    console.log(`✅ Uploaded: ${fileName}`);

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    // Construct public URL
    const publicUrl = `${PUBLIC_MEDIA_URL}/${encodeURIComponent(fileName)}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('❌ FTP Upload Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    client.close();
  }
}

/**
 * Test FTP connection
 * @returns Promise<boolean> indicating if connection was successful
 */
export async function testFTPConnection(): Promise<boolean> {
  const client = new Client();

  try {
    await client.access(FTP_CONFIG);
    console.log('✅ FTP Connection successful!');
    console.log(`   Host: ${FTP_CONFIG.host}`);
    console.log(`   User: ${FTP_CONFIG.user}`);

    // List current directory
    const list = await client.list();
    console.log('✅ Directory listing:');
    list.slice(0, 5).forEach(item => {
      console.log(`   - ${item.name} (${item.type})`);
    });

    return true;
  } catch (error) {
    console.error('❌ FTP Connection failed:', error);
    return false;
  } finally {
    client.close();
  }
}
