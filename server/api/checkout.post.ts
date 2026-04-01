import nodemailer from 'nodemailer';
import { generateOrderReceiptHtml } from '../utils/emailTemplate';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl;
  
  // Safely extract data
  const customer = body.customer || {};
  const cart = body.cart || [];
  const total = body.total || body.cartTotal || 0;
  const branch = body.branch || {};
  const paymentMethod = body.paymentMethod || 'Bank Transfer';

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
