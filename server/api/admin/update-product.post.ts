import { configureCloudinary, uploadBufferToCloudinary, validateGalleryFiles, validateImageFile } from '../../utils/productMedia'

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, 'content-type') || ''
  const isMultipart = contentType.includes('multipart/form-data')
  const config = useRuntimeConfig()

  let productId: string | null = null
  let productName: string | null = null
  let productPrice: string | number | null = null
  let productDescription: string | null = null
  let productSpecs: unknown = null
  let productDisabled = false
  let mainImageUrl: string | null = null
  let galleryUrls: string[] = []
  let removeMainImage = false
  let mainImageFile: any = null
  let newGalleryFiles: any[] = []

  if (isMultipart) {
    configureCloudinary()
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form data',
      })
    }

    const getField = (name: string) => {
      const field = formData.find((entry) => entry.name === name)
      return field ? sanitizePayload(field.data.toString()) : null
    }

    productId = getField('productId')
    productName = getField('productName')
    productPrice = getField('productPrice')
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
      const uploadedMainImage: any = await uploadBufferToCloudinary(mainImageFile.data)
      mainImageUrl = uploadedMainImage.secure_url
    } else if (removeMainImage) {
      mainImageUrl = ''
    }

    validateGalleryFiles(newGalleryFiles)

    if (newGalleryFiles.length > 0) {
      const uploadedGallery = await Promise.all(
        newGalleryFiles.map((file) => uploadBufferToCloudinary(file.data))
      )
      galleryUrls = [...galleryUrls, ...uploadedGallery.map((item: any) => item.secure_url)]
    }
  } else {
    const body = sanitizePayload(await readBody(event))
    productId = body.productId
    productName = body.productName
    productPrice = body.productPrice
    productDescription = body.productDescription
    productSpecs = body.productSpecs
    productDisabled = !!body.productDisabled
  }

  // Security check handled by admin-auth server middleware

  if (!productId || !productName || !productPrice) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: ID, Name, Price',
    });
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
    const updateResponse = await $fetch<{ result: any }>(
      `${formattedBitrixUrl}crm.product.update`,
      {
        method: 'POST',
        body: {
          id: productId,
          fields,
        },
      }
    )

    if (!updateResponse.result) {
      throw new Error('Update failed in Bitrix');
    }

    return {
      success: true,
      message: `Product "${productName}" updated successfully`,
      productId: updateResponse.result,
    };
  } catch (error) {
    console.error('[UPDATE] Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to update product',
    });
  }
});
