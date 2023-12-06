import { TProduct } from '@/types/wcRestApi'
import { FormInstance } from 'antd'
import { TPSMeta } from '@/types'

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

export const formatShopMeta = async ({ form }: { form: FormInstance<any> }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allFields_obj = form.getFieldsValue()
      const allFields = Object.values(allFields_obj) as TPSMeta[]
      resolve(allFields)
    }, 1000)

    // 時間太短會抓不到可變商品產生的欄位
  })
}

export const getUrlParam = (name: string) => {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const parameterValue = params.get(name)

  return parameterValue
}
