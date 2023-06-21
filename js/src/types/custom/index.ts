export type TFSVariation = {
  variationId: number
  regularPrice: number
  salesPrice: number
}

export type TFSMeta = {
  productId: number
  type: string
  variations?: TFSVariation[]
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
