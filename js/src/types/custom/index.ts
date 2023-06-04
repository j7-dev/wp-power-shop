export type TVariation = {
  variationId: number
  regularPrice: string
  salesPrice: string
}

export type TFastShopMeta = {
  productId: number
  type: string
  variations?: TVariation[]
  regularPrice?: string
  salesPrice?: string
}
