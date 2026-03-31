import nodemailer from 'nodemailer';
import { generateServiceBookingHtml } from '../utils/emailTemplate';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl;
  
  // Safely extract data
  const { customer, serviceName, servicePrice, requestedDate, notes } = body;
  
  if (!customer || !customer.email || !requestedDate) {
    throw createError({ statusCode: 400, message: 'Missing required booking information.' });
  }

  // 1. FORMAT FOR CRM
  const crmComments = `
    NEW SERVICE BOOKING REQUEST
    Service: ${serviceName}
    Requested Date: ${requestedDate}
    Notes: ${notes || 'None'}
    
    CUSTOMER INFO:
    Name: ${customer.firstName} ${customer.lastName}
    Email: ${customer.email}
    Phone: ${customer.phone}
    Address: ${customer.address}
  `;

  // 2. SEND TO BITRIX CRM (Create a Lead)
  if (bitrixUrl) {
    try {
      console.log('Attempting to send service booking to Bitrix...');
      await $fetch(`${bitrixUrl}crm.lead.add`, {
        method: 'POST',
        body: {
          fields: {
            TITLE: `Service Booking: ${serviceName} - ${customer.firstName} ${customer.lastName}`,
            NAME: customer.firstName,
            LAST_NAME: customer.lastName,
            EMAIL: [{ VALUE: customer.email, VALUE_TYPE: "WORK" }],
            PHONE: [{ VALUE: customer.phone, VALUE_TYPE: "WORK" }],
            ADDRESS: customer.address,
            OPPORTUNITY: servicePrice || 0,
            CURRENCY_ID: "NGN",
            COMMENTS: crmComments,
            SOURCE_ID: "WEB" 
          }
        }
      });
      console.log('✅ Successfully created Service Booking Lead in Bitrix!');
    } catch (error: any) {
      console.error('❌ Bitrix CRM Error:', error?.data || error);
      // We don't throw here so the customer still gets their email
    }
  } else {
    console.error('❌ Bitrix Webhook URL is missing from Nuxt config!');
  }

  // 3. GENERATE EMAIL HTML
  const bookingData = {
    serviceName,
    requestedDate,
    price: servicePrice,
    customerName: `${customer.firstName} ${customer.lastName}`,
    address: customer.address,
    requestDateStamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const premiumHtmlEmail = generateServiceBookingHtml(bookingData);

  // 4. SEND CONFIRMATION EMAIL VIA BREVO/SMTP
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
        subject: `Your Novel Solar Service Request: ${serviceName}`,
        html: premiumHtmlEmail
      });
      console.log('✅ Successfully sent Service Booking Receipt Email!');
    } catch (error) {
      console.error('❌ Email Error:', error);
    }
  }

  return { success: true, message: 'Booking processed successfully' };
});
