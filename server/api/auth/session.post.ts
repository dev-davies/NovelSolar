import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { createUserSession } from '../../utils/userSession'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. No Supabase session found.'
    })
  }

  const email = user.email
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User email not found in Supabase session.'
    })
  }

  const config = useRuntimeConfig()
  const bitrixUrl = config.bitrixWebhookUrl
  
  if (!bitrixUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM Configuration missing'
    })
  }

  const normalizedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`
  let contactId: string | null = null

  try {
    // 1. Check if contact exists in Bitrix
    const searchResponse = await $fetch<{ result: any[] }>(`${normalizedBitrixUrl}crm.contact.list`, {
      method: 'POST',
      body: {
        filter: { EMAIL: email },
        select: ['ID', 'NAME', 'LAST_NAME']
      }
    })

    if (searchResponse.result && searchResponse.result.length > 0) {
      contactId = searchResponse.result[0].ID
    } else {
      // 2. Create a placeholder contact if not found
      const createResponse = await $fetch<{ result: string }>(`${normalizedBitrixUrl}crm.contact.add`, {
        method: 'POST',
        body: {
          fields: {
            NAME: email.split('@')[0],
            EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
            TYPE_ID: 'CLIENT',
            SOURCE_ID: 'WEB'
          }
        }
      })
      contactId = createResponse.result
    }

    if (!contactId) {
      throw new Error('Failed to obtain contact ID from CRM')
    }

    // 3. Create the custom session
    const { token, maxAge } = await createUserSession({
      contactId,
      email
    })

    // 4. Set the auth_token cookie
    setCookie(event, 'auth_token', token, {
      maxAge,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return { 
      success: true,
      redirect: '/account'
    }

  } catch (error: any) {
    console.error('[AUTH SESSION SYNC ERROR]:', error?.data || error)
    
    // Fallback: Create a temporary session if CRM is down
    // This allows the user to at least see a "Valued Customer" profile
    const { token, maxAge } = await createUserSession({
      contactId: `local_${Date.now()}`,
      email
    })

    setCookie(event, 'auth_token', token, {
      maxAge,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return { 
      success: true,
      message: 'Logged in with local session (CRM offline)',
      redirect: '/account'
    }
  }
})
