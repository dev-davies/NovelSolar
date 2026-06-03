import { logger } from '../utils/logger'
import { getSupabaseAdminClient } from '../utils/supabaseAdmin'
import { resolveIsDealerFromEvent } from '../utils/dealerCheck'
import { fetchAllBitrixProducts } from '../utils/fetchAllBitrixProducts'
import { normalizeProperty } from '../utils/normalizeProperty'

export default defineEventHandler(async (event) => {
  const isDealer = await resolveIsDealerFromEvent(event)
  const queryParams = getQuery(event)
  const q = ((queryParams.q as string) || '').trim()
  const brand = ((queryParams.brand as string) || '').trim()
  const start = Number.parseInt((queryParams.start as string) || '0', 10) || 0

  interface MappedProduct {
    ID: string | number
    NAME: string | undefined
    PRICE: string | number | undefined
    imageUrl: string | null
    PROPERTY_102: string | null
    PROPERTY_104: string | null
    PROPERTY_112: string | null
    dealerPrice?: number
    [key: string]: unknown
  }

  const mapProduct = (p: any, fromDb = true): MappedProduct => {
    let raw: any
    let id, name, price, active, dealer_price

    if (fromDb) {
      raw = p.raw || {}
      id = p.id
      name = p.name
      price = p.price
      active = p.active ? 'Y' : 'N'
      dealer_price = p.dealer_price
    } else {
      raw = p
      id = p.ID
      name = p.NAME
      price = p.PRICE
      active = p.ACTIVE
      const rawDealerPrice = normalizeProperty(p.PROPERTY_116)
      dealer_price = rawDealerPrice !== undefined && rawDealerPrice !== null ? Number(rawDealerPrice) : null
    }

    const productObj: MappedProduct = {
      ...raw,
      ID: id as string | number,
      NAME: name,
      PRICE: price,
      ACTIVE: active,
      DETAIL_PICTURE: raw.DETAIL_PICTURE || null,
      PREVIEW_PICTURE: raw.PREVIEW_PICTURE || null,
      imageUrl: null, // As previously hardcoded
      PROPERTY_44: normalizeProperty(raw.PROPERTY_44),
      PROPERTY_102: normalizeProperty(raw.PROPERTY_102),
      PROPERTY_104: normalizeProperty(raw.PROPERTY_104),
      PROPERTY_112: normalizeProperty(raw.PROPERTY_112),
    }

    if (isDealer && dealer_price != null) {
      productObj.dealerPrice = Number(dealer_price)
    }

    delete productObj.PROPERTY_116
    return productObj
  }

  const supabase = getSupabaseAdminClient()

  let dbProducts: any[] | null = null

  try {
    let query = supabase.from('products').select('*').eq('active', true).order('id', { ascending: false })

    if (brand && q) {
      query = query.ilike('name', `%${brand} ${q}%`)
    } else if (brand) {
      query = query.ilike('name', `%${brand}%`)
    } else if (q) {
      query = query.ilike('name', `%${q}%`)
    }

    // start (for pagination, range of 50)
    query = query.range(start, start + 49)

    const { data, error } = await query

    if (error) {
      throw error
    }
    dbProducts = data
  } catch (error) {
    logger.warn('Inventory', 'Supabase unavailable, falling back to Bitrix', { error })
  }

  if (dbProducts) {
    // Fire background sync check
    try {
      const { data: syncMeta } = await supabase
        .from('sync_meta')
        .select('value')
        .eq('key', 'products_last_synced')
        .maybeSingle()

      const lastSynced = syncMeta?.value ? new Date(syncMeta.value) : null
      const sevenHoursAgo = new Date(Date.now() - 7 * 60 * 60 * 1000)

      if (!lastSynced || lastSynced < sevenHoursAgo) {
        const config = useRuntimeConfig()
        const cronSecret = config.cronSecret
        $fetch('/api/admin/trigger-sync', {
          method: 'POST',
          headers: { Authorization: `Bearer ${cronSecret}` },
        }).catch((e) => logger.error('Inventory', 'Background sync failed to start', { error: e }))
      }
    } catch (metaError) {
      logger.error('Inventory', 'Failed to check sync metadata', { error: metaError })
    }

    return dbProducts.map((p) => mapProduct(p, true))
  }

  // FALLBACK
  try {
    const allBitrixProducts = await fetchAllBitrixProducts(event)

    let filtered = allBitrixProducts.filter((p) => p.ACTIVE === 'Y')

    if (brand && q) {
      filtered = filtered.filter(
        (p) => p.NAME && String(p.NAME).toLowerCase().includes(`${brand.toLowerCase()} ${q.toLowerCase()}`),
      )
    } else if (brand) {
      filtered = filtered.filter((p) => p.NAME && String(p.NAME).toLowerCase().includes(brand.toLowerCase()))
    } else if (q) {
      filtered = filtered.filter((p) => p.NAME && String(p.NAME).toLowerCase().includes(q.toLowerCase()))
    }

    // ordered by id descending
    filtered.sort((a, b) => Number(b.ID) - Number(a.ID))

    const paginated = filtered.slice(start, start + 50)
    return paginated.map((p) => mapProduct(p, false))
  } catch (fallbackError) {
    logger.error('Inventory', 'Bitrix fallback failed', { error: fallbackError })
    throw createError({ statusCode: 500, statusMessage: 'Unable to fetch inventory' })
  }
})
