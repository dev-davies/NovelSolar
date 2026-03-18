import nodemailer from 'nodemailer';

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
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'mail.novelsolar.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true, // Use true for port 465 (SSL)
        auth: { 
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS 
        },
        tls: {
          // Do not fail on invalid certs if cPanel is using a self-signed mail certificate
          rejectUnauthorized: false 
        }
      });

      const mailOptions = {
        from: `"Novel Solar" <${process.env.SMTP_USER}>`,
        to: customer.email,
        subject: "Your Novel Solar Order Confirmation",
        html: `
          <div style="font-family: sans-serif; color: #333; max-w-2xl; margin: 0 auto;">
            <h2 style="color: #002888;">Thank you for your order, ${customer.firstName}!</h2>
            <p>We have received your order and our team is processing it now.</p>
            <h3>Order Summary:</h3>
            <pre style="background: #f8f6f6; padding: 15px; border-radius: 8px;">${orderDetailsList}</pre>
            <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
            <p><strong>Fulfillment Branch:</strong> ${branch?.address || 'N/A'}</p>
            <br/>
            <p>If you have any questions, reply to this email or contact us on WhatsApp.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email Error:', error);
    }
  }

  return { success: true, message: 'Order processed successfully' };
});
