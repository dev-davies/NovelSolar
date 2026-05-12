import { configureCloudinary, uploadBufferToCloudinary, validateImageFile } from '../../../utils/productMedia'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  configureCloudinary()

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })
  }

  const imageFile = formData.find(f => f.name === 'image')
  if (!imageFile) {
    throw createError({ statusCode: 400, statusMessage: 'Missing image file (field name: image).' })
  }

  validateImageFile(imageFile, 'Cover image')

  try {
    const result = await uploadBufferToCloudinary(imageFile.data, 'novel_solar_blog')
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error('Blog Upload Image', 'Upload error', { error: message })
    throw createError({
      statusCode: 500,
      statusMessage: message || 'Failed to upload blog cover image.',
    })
  }
})
