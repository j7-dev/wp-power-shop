export type TVariation = {
  variationId: number
  regularPrice: number
  salesPrice: number
}

export type TFSMeta = {
  productId: number
  type: string
  variations?: TVariation[]
  regularPrice?: number
  salesPrice?: number
}

export const defaultFSMeta: TFSMeta = {
  productId: 0,
  type: '',
  variations: [],
  regularPrice: 0,
  salesPrice: 0,
}
