import {
  configureCloudinary,
  uploadBufferToCloudinary,
  validateGalleryFiles,
  validateImageFile,
  type UploadedImageFile,
} from '../../utils/productMedia'
import type { BitrixResponse } from '../../types/bitrix'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, 'content-type') || ''
  const isMultipart = contentType.includes('multipart/form-data')
  const config = useRuntimeConfig()

  let productId: string | null = null
  let productName: string | null = null
  let productPrice: string | number | null = null
  let productDealerPrice: string | number | null = null
  let productDescription: string | null = null
  let productSpecs: unknown = null
  let productDisabled = false
  let mainImageUrl: string | null = null
  let galleryUrls: string[] = []
  let removeMainImage = false
  let mainImageFile: UploadedImageFile | undefined = undefined
  let newGalleryFiles: UploadedImageFile[] = []

  if (isMultipart) {
    configureCloudinary()
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form data',
      })
    }

    const getField = (name: string): string | null => {
      const field = formData.find((entry) => entry.name === name)
      return field ? (sanitizePayload(field.data.toString()) as string) : null
    }

    productId = getField('productId')
    productName = getField('productName')
    productPrice = getField('productPrice')
    productDealerPrice = getField('productDealerPrice')
    productDescription = getField('productDescription')
    productDisabled = getField('productDisabled') === 'true'
    mainImageUrl = getField('mainImageUrl')
    removeMainImage = getField('removeMainImage') === 'true'
    mainImageFile = formData.find((entry) => entry.name === 'mainImageFile')
    newGalleryFiles = formData.filter((entry) => entry.name === 'newGalleryFiles')

    const specsRaw = getField('productSpecs')
    const galleryRaw = getField('galleryUrls')

    try {
      productSpecs = specsRaw ? JSON.parse(specsRaw) : []
    } catch {
      productSpecs = []
    }

    try {
      const parsedGallery = galleryRaw ? JSON.parse(galleryRaw) : []
      galleryUrls = Array.isArray(parsedGallery) ? parsedGallery : []
    } catch {
      galleryUrls = []
    }

    if (mainImageFile) {
      validateImageFile(mainImageFile, 'Main image')
      const uploadedMainImage = await uploadBufferToCloudinary(mainImageFile.data)
      mainImageUrl = uploadedMainImage.secure_url
    } else if (removeMainImage) {
      mainImageUrl = ''
    }

    validateGalleryFiles(newGalleryFiles)

    if (newGalleryFiles.length > 0) {
      const uploadedGallery = await Promise.all(newGalleryFiles.map((file) => uploadBufferToCloudinary(file.data)))
      galleryUrls = [...galleryUrls, ...uploadedGallery.map((item) => item.secure_url)]
    }
  } else {
    const body = sanitizePayload(await readBody(event)) as Record<string, string | number | boolean | null | undefined>
    productId = body.productId
    productName = body.productName
    productPrice = body.productPrice
    productDealerPrice = body.productDealerPrice
    productDescription = body.productDescription
    productSpecs = body.productSpecs
    productDisabled = !!body.productDisabled
  }

  // Security check handled by admin-auth server middleware

  if (!productId || !productName || !productPrice) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: ID, Name, Price',
    })
  }

  try {
    const bitrixUrl = config.bitrixWebhookUrl
    if (!bitrixUrl) {
      throw createError({ statusCode: 500, statusMessage: 'Bitrix not configured' })
    }

    const formattedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`

    const fields: Record<string, unknown> = {
      NAME: productName,
      PRICE: productPrice,
      PURCHASE_PRICE: productDealerPrice || '',
      DESCRIPTION: productDescription || '',
      DESCRIPTION_TYPE: 'html',
      ACTIVE: productDisabled ? 'N' : 'Y',
      PROPERTY_104: productSpecs ? JSON.stringify(productSpecs) : '[]',
    }

    if (isMultipart) {
      if (mainImageFile || removeMainImage || mainImageUrl) {
        fields.PROPERTY_102 = mainImageUrl || ''
      }
      fields.PROPERTY_112 = JSON.stringify(galleryUrls)
    }

    // Update product in Bitrix
    const updateResponse = await $fetch<BitrixResponse<number | string | boolean>>(
      `${formattedBitrixUrl}crm.product.update`,
      {
        method: 'POST',
        body: {
          id: productId,
          fields,
        },
      },
    )

    if (!updateResponse.result) {
      throw new Error('Update failed in Bitrix')
    }

    return {
      success: true,
      message: `Product "${productName}" updated successfully`,
      productId: updateResponse.result,
    }
  } catch (error) {
    logger.error('UPDATE', 'Error updating product', { error })
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to update product',
    })
  }
})
