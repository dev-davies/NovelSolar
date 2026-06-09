import { logger } from '../utils/logger'
import { getSupabaseAdminClient } from '../utils/supabaseAdmin'
import { resolveIsDealerFromEvent } from '../utils/dealerCheck'
import { fetchAllBitrixProducts } from '../utils/fetchAllBitrixProducts'
import { normalizeProperty } from '../utils/normalizeProperty'

export default defineCachedEventHandler(
  async (event) => {
    setResponseHeader(event, 'Cache-Control', 'private, no-store')

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

    // PRIMARY PATH: BITRIX
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
    } catch (error) {
      logger.warn('Inventory', 'Bitrix unavailable, falling back to Supabase', { error })
    }

    // FALLBACK PATH: SUPABASE
    const supabase = getSupabaseAdminClient()

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

      return (data || []).map((p) => mapProduct(p, true))
    } catch (fallbackError) {
      logger.error('Inventory', 'Supabase fallback failed', { error: fallbackError })
      throw createError({ statusCode: 503, statusMessage: 'Product catalog temporarily unavailable.' })
    }
  },
  {
    getKey: async (event) => {
      const isDealer = await resolveIsDealerFromEvent(event)
      return isDealer ? 'inventory-dealer' : 'inventory-retail'
    },
  },
)
