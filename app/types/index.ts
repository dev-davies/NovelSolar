/** Product as returned from Bitrix24 CRM /api/inventory */
export interface BitrixProduct {
  ID: string
  id?: string
  NAME: string
  name?: string
  title?: string
  PRICE: number
  price?: number
  DETAIL_TEXT?: string
  PROPERTY_102?: string | Array<{ value: string }>
  PROPERTY_44?: { showUrl?: string; downloadUrl?: string }
  PREVIEW_PICTURE?: string | { showUrl?: string; downloadUrl?: string }
  DETAIL_PICTURE?: string | { showUrl?: string; downloadUrl?: string }
  image?: string
  [key: string]: unknown
}

/** Static product used on the /products filter page */
export interface FilterProduct {
  id: number
  title: string
  category: string
  wattage: number
  efficiency: number
  price: number
  originalPrice?: number
  image: string
}

/** Branch / outlet location */
export interface Branch {
  name: string
  address: string
  phone: string
  email1?: string
  email2?: string
  hoursWeekdays?: string
  hoursSaturday?: string
  coordinates: [number, number]
  coords: [number, number]
  city: string
  state: string
  contactPerson?: string
}

/** Partner brand entry shown on /partners */
export interface Partner {
  name: string
  slug: string
  desc: string
  logo: string
}

/** Partnership track card */
export interface PartnershipTrack {
  title: string
  description: string
}

/** Solar load calculator appliance row */
export interface Appliance {
  id: string
  name: string
  icon: string
  quantity: number
  load: number
}

/** Summary stat row in calculator */
export interface SummaryStat {
  label: string
  value: string | number
  unit: string
}

/** Blog post from Nuxt Content */
export interface BlogPost {
  _path: string
  title: string
  description?: string
  date?: string
  image?: string
  excerpt?: string
}

/** Portable text image value (Sanity) */
export interface PortableTextImageValue {
  asset?: { _ref?: string; url?: string }
  [key: string]: unknown
}

/** Nigerian state for checkout state selector */
export interface NigerianState {
  name: string
  coords: [number, number]
}

/** Navigation menu item with a title and route link */
export interface NavMenuItem {
  title: string
  link: string
}

/** Calculator price tier mapping load range to cost range */
export interface PriceTier {
  minLoad: number
  maxLoad: number | null
  minPrice: number
  maxPrice: number
}
