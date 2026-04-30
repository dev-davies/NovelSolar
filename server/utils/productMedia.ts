import { v2 as cloudinary } from 'cloudinary'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_FILE_SIZE = 10 * 1024 * 1024
export const MAX_GALLERY_FILES = 10

export interface UploadedImageFile {
  filename?: string
  type?: string
  data: Buffer
}

export function validateImageFile(file: UploadedImageFile, label: string) {
  if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: `${label}: Invalid file type "${file.type || 'unknown'}". Allowed: JPEG, PNG, WebP, GIF, AVIF.`,
    })
  }

  if (file.data.length > MAX_FILE_SIZE) {
    const sizeMB = (file.data.length / (1024 * 1024)).toFixed(1)
    throw createError({
      statusCode: 400,
      statusMessage: `${label}: File too large (${sizeMB} MB). Maximum allowed: 10 MB.`,
    })
  }
}

export function validateGalleryFiles(files: UploadedImageFile[]) {
  if (files.length > MAX_GALLERY_FILES) {
    throw createError({
      statusCode: 400,
      statusMessage: `Too many gallery images (${files.length}). Maximum allowed: ${MAX_GALLERY_FILES}.`,
    })
  }

  files.forEach((file, index) => validateImageFile(file, `Gallery image ${index + 1}`))
}

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function uploadBufferToCloudinary(buffer: Buffer, folder = 'novel_solar_products') {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error)
          reject(error)
          return
        }

        resolve(result)
      }
    )

    uploadStream.end(buffer)
  })
}
