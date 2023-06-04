import { TProduct } from '@/types'

export const formateMeta = (addedProducts: TProduct[]) => {
  const meta = addedProducts.map((product) => ({
    id: product?.id,
    sale_price: product?.sale_price ?? '',
    regular_price: product?.regular_price ?? '',
    type: product?.type ?? '',
  }))
  return meta
}
