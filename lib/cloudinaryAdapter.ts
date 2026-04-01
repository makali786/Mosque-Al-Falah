import type {
  Adapter,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import path from 'path';

export interface CloudinaryAdapterArgs {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
}

export const cloudinaryAdapter = ({
  cloudName,
  apiKey,
  apiSecret,
  folder = 'payload-media',
}: CloudinaryAdapterArgs): Adapter => {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return ({ collection, prefix }): GeneratedAdapter => {
    const baseFolder = prefix || folder;

    return {
      name: 'cloudinary',

      generateURL: ({ filename, prefix: filePrefix }) => {
        const publicId = path.posix
          .join(filePrefix || baseFolder, filename)
          .replace(/\.[^/.]+$/, '');
        // Add optimization parameters to reduce bandwidth and credits
        return cloudinary.url(publicId, { 
          secure: true,
          // Add these to reduce credit usage:
          fetch_format: 'auto',  // Serve WebP/AVIF when supported
          quality: 'auto:good',  // Automatic quality optimization
          dpr: 'auto',           // Automatic device pixel ratio
        });
      },

      handleDelete: async ({ filename }) => {
        try {
          const publicId = path.posix
            .join(baseFolder, filename)
            .replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Cloudinary delete error:', error);
        }
      },

      handleUpload: async ({ file }) => {
        return new Promise<void>((resolve, reject) => {
          const uploadOptions: UploadApiOptions = {
            folder: baseFolder,
            public_id: file.filename.replace(/\.[^/.]+$/, ''),
            resource_type: 'auto',
            overwrite: true,
            use_filename: true,
            unique_filename: false,
            // Add these to reduce storage and bandwidth:
            eager: [
              // Generate optimized versions on upload
              { width: 1920, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
              { width: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
              { width: 800, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
            ],
            eager_async: true, // Don't block upload for eager transformations
          };

          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve();
              }
            }
          );

          if (file.buffer) {
            uploadStream.end(file.buffer);
          } else {
            reject(new Error('File buffer missing'));
          }
        });
      },

      staticHandler: async (req, { params }) => {
        const { filename } = params;
        const publicId = path.posix
          .join(baseFolder, filename)
          .replace(/\.[^/.]+$/, '');
        const url = cloudinary.url(publicId, { 
          secure: true,
          fetch_format: 'auto',
          quality: 'auto:good',
        });
        return Response.redirect(url);
      },
    };
  };
};
