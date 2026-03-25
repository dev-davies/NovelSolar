import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  // 1. Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data' });
  }

  // Helper to extract fields from multipart form data
  const getField = (name: string) => {
    const field = formData.find(f => f.name === name);
    return field ? field.data.toString() : null;
  };

  // 2. Security Check: Validate Admin Passcode
  const submittedPasscode = getField('adminPasscode');
  const actualPasscode = process.env.ADMIN_UPLOAD_PASSCODE;

  if (!submittedPasscode || submittedPasscode !== actualPasscode) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid Passcode' });
  }

  // 3. Extract Product Fields
  const productName = getField('productName');
  const productPrice = getField('productPrice');
  const productType = getField('productType');
  const productDescription = getField('productDescription');
  const productSpecs = getField('productSpecs');
  const imageFile = formData.find(f => f.name === 'productImage');
  const galleryImages = formData.filter(f => f.name === 'galleryImages');

  if (!productName || !productPrice || !imageFile) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' });
  }

  try {
    // 4. Cloudinary Upload: Promise wrapper for upload_stream
    const uploadToCloudinary = (buffer: Buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'novel_solar_products' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    };

    const cloudinaryResult: any = await uploadToCloudinary(imageFile.data);
    const imageUrl = cloudinaryResult.secure_url;

    // 4.5. Gallery Uploads: Process additional images
    const galleryUploadPromises = galleryImages.map(img => uploadToCloudinary(img.data));
    const galleryResults: any = await Promise.all(galleryUploadPromises);
    const galleryUrls = galleryResults.map((r: any) => r.secure_url);

    // 5. Bitrix Upload: Add product with Cloudinary image URL in PROPERTY_44
    const webhookUrl = process.env.BITRIX_WEBHOOK_URL;
    if (!webhookUrl) throw new Error('BITRIX_WEBHOOK_URL not configured');
    const formattedWebhookUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`;

    // Determine MEASURE based on productType
    const measureId = productType === 'meter' ? 6 : 5;

    const bitrixResponse: any = await $fetch(`${formattedWebhookUrl}crm.product.add`, {
      method: 'POST',
      body: {
        fields: {
          NAME: productName,
          PRICE: productPrice,
          CURRENCY_ID: 'NGN',
          MEASURE: measureId,
          DESCRIPTION: productDescription,
          DESCRIPTION_TYPE: 'html',
          PROPERTY_102: imageUrl, // Store Cloudinary URL directly in Custom Field
          PROPERTY_104: productSpecs, // Stringified specs array
          PROPERTY_112: JSON.stringify(galleryUrls) // Stringified gallery URL array
        }
      }
    });

    if (bitrixResponse.error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Bitrix Error: ${bitrixResponse.error_description || bitrixResponse.error}`
      });
    }

    return {
      success: true,
      message: 'Product added successfully with Cloudinary image hosting',
      bitrixId: bitrixResponse.result,
      cloudinaryUrl: imageUrl
    };

  } catch (error: any) {
    console.error('Product Upload Pipeline Error:', error.message || error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    });
  }
});
