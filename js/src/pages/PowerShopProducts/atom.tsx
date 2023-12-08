import { atom } from 'jotai'
import { TProductVariationAttribute, TCart } from '@/types/wcStoreApi'

export const storeApiNonceAtom = atom<string>('')
export const isProductModalOpenAtom = atom<boolean>(false)
export const modalProductIdAtom = atom<number>(0)
export const selectedVariationIdAtom = atom<number | null>(null)
export const selectedAttributesAtom = atom<TProductVariationAttribute[]>([])
export type TShopStatus = 'published' | 'coming' | 'closed'
export const shopStatusAtom = atom<TShopStatus>('published')

export type TCartItem = {
  key: string
  id: number
  quantity: number
  quantity_raw: number // 用來儲存原始數量，用於回復數量
  name: string
  short_description: string
  description: string
  images: {
    src: string
    id?: number
    thumbnail?: string
    srcset?: string
    sizes?: string
    name?: string
    alt?: string
  }[]
  variation: {
    attribute: string
    value: string
  }[]
  isMutating: boolean
}

const defaultCart = {
  isMutating: false,
  coupons: [],
  shipping_rates: [],
  shipping_address: {
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'TW',
    first_name: '',
    last_name: '',
    company: '',
    phone: '',
  },
  billing_address: {
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'TW',
    first_name: '',
    last_name: '',
    company: '',
    phone: '',
    email: '',
  },
  items: [],
  items_count: 0,
  items_weight: 0,
  cross_sells: [],
  needs_payment: true,
  needs_shipping: false,
  has_calculated_shipping: false,
  fees: [],
  totals: {
    total_items: '0',
    total_items_tax: '0',
    total_fees: '0',
    total_fees_tax: '0',
    total_discount: '0',
    total_discount_tax: '0',
    total_shipping: '0',
    total_shipping_tax: '0',
    total_price: '0',
    total_tax: '0',
    tax_lines: [],
    currency_code: 'TWD',
    currency_symbol: 'NT$',
    currency_minor_unit: 0,
    currency_decimal_separator: '.',
    currency_thousand_separator: ',',
    currency_prefix: 'NT$',
    currency_suffix: '',
  },
  errors: [],
  payment_methods: [],
  payment_requirements: [],
  extensions: {},
}

export type TCartData = Omit<TCart, 'items'> & {
  items: TCartItem[]
  isMutating: boolean
}

export const cartDataAtom = atom<TCartData>(defaultCart)
