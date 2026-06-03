import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

export async function resolveIsDealerFromEvent(event: H3Event): Promise<boolean> {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) return false

    const supabase = await serverSupabaseServiceRole(event)
    const { data } = (await supabase
      .from('profiles')
      .select('role, dealer_status')
      .eq('user_id', user.id)
      .single()) as { data: { role: string; dealer_status: string } | null }

    return data?.role === 'dealer' && data?.dealer_status === 'approved'
  } catch {
    return false
  }
}
