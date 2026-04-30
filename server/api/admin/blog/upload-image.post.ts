import { configureCloudinary, uploadBufferToCloudinary, validateImageFile } from '../../../utils/productMedia'

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
    const result: any = await uploadBufferToCloudinary(imageFile.data, 'novel_solar_blog')
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error: any) {
    console.error('Blog image upload error:', error?.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to upload blog cover image.',
    })
  }
})
