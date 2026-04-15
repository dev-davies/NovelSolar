import { getSupabaseAdminClient } from '../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const currentUserId = event.context.admin?.user_id

  if (!currentUserId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized.'
    })
  }

  const supabase = getSupabaseAdminClient()

  const { data: adminProfile, error } = await supabase
    .from('admin_profiles')
    .select('user_id, admin_username, is_master, created_at')
    .eq('user_id', currentUserId)
    .single()

  if (error || !adminProfile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User is not an admin.'
    })
  }

  return {
    success: true,
    admin: {
      ...adminProfile,
      email: event.context.admin?.email || null
    }
  }
})
