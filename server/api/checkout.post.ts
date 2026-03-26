import nodemailer from 'nodemailer';
import { generateOrderReceiptHtml } from '../utils/emailTemplate';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl;
  
  const { customer, cart, total, branch, paymentMethod } = body;

  // 1. FORMAT CART FOR CRM & EMAIL
  const orderDetailsList = cart.map((item: any) => `- ${item.quantity}x ${item.name} (₦${item.price.toLocaleString()})`).join('\n');
  
  const crmComments = `
    NEW WEB ORDER
    Fulfillment: ${paymentMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}
    Branch: ${branch?.address || 'N/A'}
    Payment: ${paymentMethod}
    Notes: ${customer.note || 'None'}
    
    ITEMS:
    ${orderDetailsList}
  `;

  // 2. SEND TO BITRIX CRM (Create a Lead)
  if (bitrixUrl) {
    try {
      await $fetch(`${bitrixUrl}crm.lead.add`, {
        method: 'POST',
        body: {
          fields: {
            TITLE: `Web Order: ${customer.firstName} ${customer.lastName}`,
            NAME: customer.firstName,
            LAST_NAME: customer.lastName,
            EMAIL: [{ VALUE: customer.email, VALUE_TYPE: "WORK" }],
            PHONE: [{ VALUE: customer.phone, VALUE_TYPE: "WORK" }],
            ADDRESS: customer.address,
            OPPORTUNITY: total,
            CURRENCY_ID: "NGN",
            COMMENTS: crmComments,
            SOURCE_ID: "WEB"
          }
        }
      });
    } catch (error) {
      console.error('Bitrix Error:', error);
      // We don't throw here so the customer still gets their email even if CRM hiccups
    }
  }

  // 3. SEND CONFIRMATION EMAIL
  // NOTE: Requires SMTP credentials in .env (SMTP_HOST, SMTP_USER, SMTP_PASS)
  if (config.smtpUser && config.smtpPass) {
    try {
      // Generate Order Number
      const generatedOrderNumber = 'NS-' + Math.floor(100000 + Math.random() * 900000);

      // Package the data for the template
      const orderData = {
        orderNumber: generatedOrderNumber,
        orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentMethod: paymentMethod === 'pickup' ? 'Store Pickup' : 'Bank Transfer',
        branchName: branch?.address || 'N/A',
        subtotal: total,
        shipping: 0,
        total: total,
        products: cart.map((item: any) => {
          // Fallback chain for the image
          let finalImage = item.image || item.PROPERTY_102 || item.PREVIEW_PICTURE || 'https://novelsolar.ng/images/placeholder.png';
          
          // IMPORTANT: Ensure relative local placeholders become absolute URLs for the email client
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

      // Generate the HTML
      const premiumHtmlEmail = generateOrderReceiptHtml(orderData);

      const transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        secure: false, // Must be false for port 587
        auth: { 
          user: config.smtpUser, 
          pass: config.smtpPass 
        },
        tls: {
          rejectUnauthorized: false 
        }
      });


      const mailOptions = {
        from: config.smtpFrom,
        to: customer.email,
        subject: "Your Novel Solar Order Confirmed: #" + generatedOrderNumber,
        html: premiumHtmlEmail
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email Error:', error);
    }
  }

  return { success: true, message: 'Order processed successfully' };
});
