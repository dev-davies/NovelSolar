import { getUserSession, createUserSession } from '../../utils/userSession'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl;
  const authToken = getCookie(event, 'auth_token');
  const userSession = await getUserSession(authToken);
  const body = await readBody(event);
  const { firstName, lastName, phone, address } = body;

  if (!userSession) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  
  const contactId = userSession.contactId;
  const isLocalSession = contactId.startsWith('local_') || contactId.startsWith('temp_');

  if (!bitrixUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM Configuration missing',
    });
  }

  const normalizedBitrixUrl = bitrixUrl.endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

  try {
    let finalContactId = contactId;

    if (isLocalSession) {
      // 1. Create a NEW contact for this previously local session
      console.log(`[AUTH] Promoting local session for ${userSession.email} to real CRM contact`);
      const createResponse = await $fetch<{ result: string }>(`${normalizedBitrixUrl}crm.contact.add`, {
        method: 'POST',
        body: {
          fields: {
            NAME: firstName,
            LAST_NAME: lastName,
            EMAIL: [{ VALUE: userSession.email, VALUE_TYPE: "WORK" }],
            PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
            ADDRESS: address,
            TYPE_ID: 'CLIENT',
            SOURCE_ID: 'WEB'
          }
        }
      });
      finalContactId = createResponse.result;

      // 2. Update the session with the new real contactId
      const { token, maxAge } = await createUserSession({
        contactId: finalContactId,
        email: userSession.email
      });

      setCookie(event, 'auth_token', token, {
        maxAge,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    } else {
      // 3. Regular update for existing contacts
      await $fetch(`${normalizedBitrixUrl}crm.contact.update`, {
        method: 'POST',
        body: {
          id: finalContactId,
          fields: {
            NAME: firstName,
            LAST_NAME: lastName,
            PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
            ADDRESS: address
          }
        }
      });
    }

    return { 
      success: true, 
      message: isLocalSession ? 'Account created and profile updated successfully' : 'Profile updated successfully',
      contactId: finalContactId
    };
  } catch (error: any) {
    console.error('Bitrix Profile Update/Promotion Error:', error?.data || error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to synchronize profile with CRM',
    });
  }
});
