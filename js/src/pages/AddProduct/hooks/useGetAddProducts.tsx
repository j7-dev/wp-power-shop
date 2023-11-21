import { getResource } from '@/api'
import { useMany } from '@/hooks'
import { TProduct, TProductVariation } from '@/types/wcRestApi'
import { useState, useEffect } from 'react'

const useGetAddProducts = (shop_meta_product_ids: number[]) => {
  const [
    result,
    setResult,
  ] = useState<any>({
    data: {
      data: [],
    },
    isLoading: true,
    isFetching: true,
  })

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      include: shop_meta_product_ids,
      status: 'publish',
    },
    queryOptions: {
      enabled: shop_meta_product_ids.length > 0,
      staleTime: 1000 * 60 * 15,
      cacheTime: 1000 * 60 * 15,
    },
  })

  const products = (productsResult?.data?.data || []) as TProduct[]

  useEffect(() => {
    if (!productsResult.isLoading) {
      Promise.all(
        products.map(async (product) => {
          if (product?.type !== 'variable' && !product?.productVariations) return product
          const productVariationsResult = await getResource({
            resource: `products/${product?.id}/variations`,
            dataProvider: 'wc',
            args: {
              per_page: 100,
            },
          })
          const productVariations: TProductVariation[] = productVariationsResult?.data ?? []
          return {
            ...product,
            productVariations,
          }
        }),
      )
        .then((res) => {
          setResult({
            data: {
              data: res,
            },
            isLoading: false,
            isFetching: false,
          })
          return res
        })
        .catch((err) => {
          console.log('err:', err)
          setResult({
            data: {
              data: [],
            },
            isLoading: false,
            isFetching: false,
          })
          return []
        })
    }
  }, [productsResult.isLoading])

  // productsResult!.data!.data = Promise.all(formattedProducts)

  return result
}

export default useGetAddProducts
