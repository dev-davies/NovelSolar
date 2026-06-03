import { defineTask } from 'nitropack'
import { logger } from '../utils/logger'
import { getSupabaseAdminClient } from '../utils/supabaseAdmin'
import { normalizeBitrixProduct, type BitrixProduct } from '../utils/normalizeBitrixProduct'

export default defineTask({
  meta: {
    name: 'sync:products',
    description: 'Sync active products from Bitrix CRM to Supabase mirror',
  },
  async run({ payload, context }) {
    logger.info('ProductSync', 'Starting Bitrix product sync...')

    const config = useRuntimeConfig()
    const bitrixUrl = config.bitrixWebhookUrl as string

    if (!bitrixUrl) {
      const error = new Error('Bitrix Webhook URL is not configured')
      logger.error('ProductSync', 'Missing configuration', { error })
      throw error
    }

    const formattedBitrixUrl = bitrixUrl.endsWith('/') ? bitrixUrl : `${bitrixUrl}/`

    let start = 0
    let hasMore = true
    const allProducts: BitrixProduct[] = []

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, 30000)

    try {
      // 1. Fetch from Bitrix
      while (hasMore) {
        const endpoint = `crm.product.list${start > 0 ? `?start=${start}` : ''}`
        const url = `${formattedBitrixUrl}${endpoint}`

        const response = await $fetch<{ result: BitrixProduct[]; next?: number }>(url, {
          method: 'POST',
          body: {
            limit: 50,
            filter: { ACTIVE: 'Y' },
            select: [
              'ID',
              'NAME',
              'PRICE',
              'QUANTITY',
              'CURRENCY_ID',
              'SECTION_ID',
              'ACTIVE',
              'PROPERTY_102',
              'PROPERTY_104',
              'PROPERTY_112',
              'PROPERTY_116',
              'DETAIL_PICTURE',
              'PREVIEW_PICTURE',
              'PROPERTY_44',
            ],
          },
          signal: abortController.signal,
        })

        if (response?.result && Array.isArray(response.result)) {
          allProducts.push(...response.result)
          logger.info('ProductSync', `Fetched ${allProducts.length} products so far...`)
        }

        if (typeof response?.next === 'number') {
          start = response.next
        } else {
          hasMore = false
        }
      }

      // 2. Normalize
      const mappedProducts = allProducts.map(normalizeBitrixProduct)

      // 3. Upsert to Supabase
      const supabase = getSupabaseAdminClient()
      if (mappedProducts.length > 0) {
        const { error: upsertError } = await supabase.from('products').upsert(mappedProducts, { onConflict: 'id' })
        if (upsertError) throw upsertError
      }

      // 4. Delete removed products
      const syncedIds = mappedProducts.map((p) => p.id)
      let deletedCount = 0

      if (syncedIds.length > 0) {
        // Delete rows where id is not in the synced IDs
        const { data: deletedRows, error: deleteError } = await supabase
          .from('products')
          .delete()
          .not('id', 'in', `(${syncedIds.join(',')})`)
          .select('id')

        if (deleteError) throw deleteError
        deletedCount = deletedRows?.length || 0
      } else {
        // If 0 products synced, delete everything
        const { data: deletedRows, error: deleteError } = await supabase
          .from('products')
          .delete()
          .neq('id', 'prevent-empty-error') // Match everything
          .select('id')

        if (deleteError) throw deleteError
        deletedCount = deletedRows?.length || 0
      }

      // 5. Update sync metadata
      const { error: metaError } = await supabase
        .from('sync_meta')
        .upsert({ key: 'products_last_synced', value: new Date().toISOString() }, { onConflict: 'key' })
      if (metaError) throw metaError

      // 6. Complete
      logger.info('ProductSync', 'Sync complete', { synced: mappedProducts.length, deleted: deletedCount })
      return { synced: mappedProducts.length, deleted: deletedCount }
    } catch (error: any) {
      if (error.name === 'AbortError' || abortController.signal.aborted) {
        const timeoutErr = new Error('Bitrix catalog fetch timed out after 30s')
        logger.error('ProductSync', 'Timeout error', { error: timeoutErr })
        throw timeoutErr
      }

      logger.error('ProductSync', 'Sync failed', { error })
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  },
})
