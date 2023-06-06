export type TVariation = {
  variationId: number
  regularPrice: number
  salesPrice: number
}

export type TFastShopMeta = {
  productId: number
  type: string
  variations?: TVariation[]
  regularPrice?: number
  salesPrice?: number
}
