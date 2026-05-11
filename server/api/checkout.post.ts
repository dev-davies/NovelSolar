import nodemailer from 'nodemailer';
import { z } from 'zod';
import { generateOrderReceiptHtml } from '../utils/emailTemplate';
import { fetchWithBitrixContext } from '../utils/bitrixAuth';
import { normalizeProperty } from '../utils/normalizeProperty';

type SubmittedCartItem = {
  id?: string | number;
  ID?: string | number;
  quantity?: number;
  image?: string;
}

type TrustedCartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(30),
    address: z.string().trim().min(5).max(500),
    note: z.string().trim().max(1000).optional().default(''),
  }),
  cart: z.array(z.object({
    id: z.union([z.string().trim().min(1).max(80), z.number().int().positive()]).optional(),
    ID: z.union([z.string().trim().min(1).max(80), z.number().int().positive()]).optional(),
    quantity: z.number().int().min(1).max(99),
  }).refine((item) => item.id || item.ID, {
    message: 'A product id is required.',
  })).min(1).max(50),
  branch: z.object({
    address: z.string().trim().max(500).optional(),
    state: z.string().trim().max(100).optional(),
    name: z.string().trim().max(160).optional(),
  }).passthrough().optional().default({}),
  paymentMethod: z.string().trim().min(2).max(80).optional().default('Bank Transfer'),
});

async function resolveTrustedCart(event: any, submittedCart: SubmittedCartItem[]) {
  if (!Array.isArray(submittedCart) || submittedCart.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart cannot be empty.',
    });
  }

  const trustedCart: TrustedCartItem[] = [];

  for (const item of submittedCart) {
    const productId = item?.id || item?.ID;
    const quantity = Number(item?.quantity);

    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart contains an invalid product or quantity.',
      });
    }

    const response = await fetchWithBitrixContext<{ result?: any }>(event, `crm.product.get?id=${encodeURIComponent(String(productId))}`);
    const product = response?.result;

    if (!product || product.ACTIVE === 'N') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart contains an unavailable product.',
      });
    }

    const price = Number(product.PRICE);

    if (!Number.isFinite(price) || price < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart contains a product with invalid pricing.',
      });
    }

    const cloudinaryUrl = normalizeProperty(product.PROPERTY_102);
    const bitrixImage = normalizeProperty(product.PROPERTY_44)
      || normalizeProperty(product.PREVIEW_PICTURE)
      || normalizeProperty(product.DETAIL_PICTURE);
    const image = cloudinaryUrl
      || (bitrixImage ? `/api/bitrix-image?url=${encodeURIComponent(bitrixImage)}` : '/images/placeholder.png');

    trustedCart.push({
      id: product.ID || productId,
      name: product.NAME || `Product ${productId}`,
      price,
      image,
      quantity,
    });
  }

  const total = trustedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { cart: trustedCart, total };
}

export default defineEventHandler(async (event) => {
  const rawBody = sanitizePayload(await readBody(event));
  const parsedBody = checkoutSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedBody.error.issues[0]?.message || 'Invalid checkout details.',
    });
  }

  const body = parsedBody.data;
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl;
  
  // Safely extract data
  const customer = body.customer || {};
  const { cart, total } = await resolveTrustedCart(event, body.cart || []);
  const branch = body.branch || {};
  const paymentMethod = body.paymentMethod || 'Bank Transfer';

  if (!isValidEmail(customer.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email address.',
    });
  }

  // Generate a unique order ID
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Prepare the order payload for CRM or fallback storage
  const orderPayload = {
    orderId,
    customer,
    cart,
    total,
    branch,
    paymentMethod,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  // 1. FORMAT CART FOR CRM
  const orderDetailsList = cart.map((item: any) => `- ${item.quantity}x ${item.name} (₦${item.price.toLocaleString()})`).join('\n');
  
  const crmComments = `
    NEW WEB ORDER (${orderId})
    Fulfillment: ${paymentMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}
    Branch: ${branch?.address || 'N/A'}
    Payment: ${paymentMethod}
    Notes: ${customer.note || 'None'}
    
    ITEMS:
    ${orderDetailsList}
  `;

  // 2. SEND TO BITRIX CRM (Create a Lead) — with Safety Net fallback
  let crmSuccess = false;

  try {
    if (!bitrixUrl) throw new Error('Bitrix Webhook URL is missing from ENV');
    const normalizedBitrixUrl = bitrixUrl.endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

    console.log(`Attempting to send order ${orderId} to Bitrix...`);
    const response: any = await $fetch(`${normalizedBitrixUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Web Order: ${customer.firstName || 'Guest'} ${customer.lastName || ''} (${orderId})`,
          NAME: customer.firstName || 'Guest',
          LAST_NAME: customer.lastName || '',
          EMAIL: [{ VALUE: customer.email, VALUE_TYPE: "WORK" }],
          PHONE: [{ VALUE: customer.phone || '0000000000', VALUE_TYPE: "WORK" }],
          ADDRESS: customer.address || customer.streetAddress || '',
          OPPORTUNITY: total,
          CURRENCY_ID: "NGN",
          COMMENTS: crmComments,
          SOURCE_ID: "WEB"
        }
      }
    });

    if (response.error) throw new Error(response.error_description);

    crmSuccess = true;
    console.log(`✅ Successfully created Lead in Bitrix for order ${orderId}`);
  } catch (error: any) {
    console.error(`[CHECKOUT ERROR] Bitrix failed for order ${orderId}:`, error.message);

    // THE SAFETY NET: Save the order to Nitro's local storage
    try {
      const storage = useStorage('data:failed-orders');
      await storage.setItem(orderId, orderPayload);
      console.log(`[CHECKOUT RECOVERY] Order ${orderId} saved to fallback queue.`);
    } catch (storageError) {
      console.error('[CRITICAL] Failed to save order to fallback storage:', storageError);
    }
  }

  // 3. GENERATE PREMIUM EMAIL HTML (always runs regardless of CRM status)
  const generatedOrderNumber = 'NS-' + Math.floor(100000 + Math.random() * 900000);
  
  const orderData = {
    orderNumber: generatedOrderNumber,
    orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    paymentMethod: paymentMethod === 'pickup' ? 'Store Pickup' : 'Bank Transfer',
    branchName: branch?.address || 'N/A',
    subtotal: total,
    shipping: 0,
    total: total,
    products: cart.map((item: any) => {
      let finalImage = item.image || item.PROPERTY_102 || item.PREVIEW_PICTURE || 'https://novelsolar.ng/images/placeholder.png';
      if (typeof finalImage === 'string' && finalImage.startsWith('/')) {
        finalImage = `https://novelsolar.ng${finalImage}`;
      }
      return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: finalImage
      };
    })
  };

  const premiumHtmlEmail = generateOrderReceiptHtml(orderData);

  // 4. SEND CONFIRMATION EMAIL VIA BREVO
  if (config.smtpUser && config.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        secure: false,
        auth: { 
          user: config.smtpUser, 
          pass: config.smtpPass 
        },
        tls: { rejectUnauthorized: false }
      });

      await transporter.sendMail({
        from: config.smtpFrom,
        to: customer.email,
        subject: `Your Novel Solar Order Confirmed: #${generatedOrderNumber}`,
        html: premiumHtmlEmail
      });
      console.log('✅ Successfully sent Order Receipt Email!');
    } catch (error) {
      console.error('❌ Email Error:', error);
    }
  }

  return { 
    success: true, 
    orderId,
    message: crmSuccess 
      ? 'Order processed successfully.' 
      : 'Order received. (Queued locally due to CRM timeout).'
  };
});
