import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()

supabase.from('sync_meta').update({ value: eightHoursAgo }).eq('key', 'products_last_synced')
  .then(({ error }) => {
    if (error) console.error(error)
    else console.log('Updated to 8 hours ago')
  })
