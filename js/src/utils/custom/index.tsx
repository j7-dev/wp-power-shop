import { TProduct } from '@/types/wcRestApi'

export const formateMeta = (addedProducts: TProduct[]) => {
  const meta = addedProducts.map((product) => ({
    id: product?.id,
    sale_price: product?.sale_price ?? '',
    regular_price: product?.regular_price ?? '',
    type: product?.type ?? '',
  }))
  return meta
}

export const getProductTypeLabel = (type: string) => {
  switch (type) {
    case 'simple':
      return '簡單商品'
    case 'variable':
      return '可變商品'

    default:
      return '未知類型'
  }
}
