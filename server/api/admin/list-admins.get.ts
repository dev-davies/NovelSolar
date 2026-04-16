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

  const { data: currentAdmin, error: currentAdminError } = await supabase
    .from('admin_profiles')
    .select('is_master')
    .eq('user_id', currentUserId)
    .single()

  if (currentAdminError || !currentAdmin?.is_master) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only master admins can view admin accounts.'
    })
  }

  const { data: admins, error: adminsError } = await supabase
    .from('admin_profiles')
    .select('user_id, admin_username, is_master, created_at')
    .order('created_at', { ascending: false })

  if (adminsError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch admin list.'
    })
  }

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch admin emails.'
    })
  }

  const adminsWithEmail = (admins || []).map((admin) => {
    const authUser = usersData.users.find((user) => user.id === admin.user_id)
    return {
      ...admin,
      email: authUser?.email || 'unknown'
    }
  })

  return {
    success: true,
    isMasterAdmin: true,
    currentUserId,
    admins: adminsWithEmail
  }
})
