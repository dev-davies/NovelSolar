import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)

  try {
    // Get all applications
    const { data: applications, error: appError } = await supabase
      .from('dealer_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (appError) throw createError({ statusCode: 500, statusMessage: appError.message })

    // Get all invitations
    const { data: invitations, error: invError } = await supabase.from('dealer_invitations').select('*')

    if (invError) throw createError({ statusCode: 500, statusMessage: invError.message })

    // Merge them based on email
    const merged = applications.map((app: Record<string, unknown>) => {
      const invites = invitations.filter((inv: Record<string, unknown>) => inv.email === app.email)
      invites.sort(
        (a: Record<string, unknown>, b: Record<string, unknown>) =>
          new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime(),
      )
      const latestInvite = invites.length > 0 ? invites[0] : null

      return {
        ...app,
        invitation: latestInvite,
      }
    })

    return { success: true, dealers: merged }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Admin API', 'Error fetching dealers', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
