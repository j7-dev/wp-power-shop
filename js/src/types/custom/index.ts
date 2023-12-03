export type TFSVariation = {
  variationId: number
  regularPrice: number
  salesPrice: number
}

export type TPSMeta = {
  productId: number
  productType?: string
  variations?: TFSVariation[]
  regularPrice?: number | string
  salesPrice?: number | string
}

export const defaulTPSMeta: TPSMeta = {
  productId: 0,
  variations: [],
  regularPrice: 0,
  salesPrice: 0,
}

export type TSettings = {
  startTime: number
  endTime: number
  btnColor: string
  isConfetti: boolean
}

export const defaultSettings = {
  startTime: 0,
  endTime: 0,
  btnColor: '#1677ff',
}

// Ajax Product

export type TAjaxProductVariation = {
  regularPrice?: number | string
  salesPrice?: number | string
  attributes: {
    [key: string]: string
  }
  availability_html: string
  backorders_allowed: boolean
  dimensions: {
    length: string
    width: string
    height: string
  }
  dimensions_html: string
  display_price: number
  display_regular_price: number
  image: {
    title: string
    caption: string
    url: string
    alt: string
    src: string
    srcset: string
    sizes: string
    full_src: string
    full_src_w: number
    full_src_h: number
    gallery_thumbnail_src: string
    gallery_thumbnail_src_w: number
    gallery_thumbnail_src_h: number
    thumb_src: string
    thumb_src_w: number
    thumb_src_h: number
    src_w: number
    src_h: number
  }
  image_id: number
  is_downloadable: boolean
  is_in_stock: boolean
  is_purchasable: boolean
  is_sold_individually: string
  is_virtual: boolean
  max_qty: string
  min_qty: number
  price_html: string
  sku: string
  variation_description: string
  variation_id: number
  variation_is_active: boolean
  variation_is_visible: boolean
  weight: string
  weight_html: string
}

export type TAjaxProduct = {
  id: number
  regularPrice?: number | string
  salesPrice?: number | string
  type: string
  name: string
  description: string
  images: string[]
  short_description: string
  sku: string
  variations?: TAjaxProductVariation[]
  variation_attributes?: {
    [key: string]: string[]
  }
}
