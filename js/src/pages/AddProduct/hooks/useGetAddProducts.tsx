import { getResource } from '@/api'
import { useMany } from '@/hooks'
import { TProduct, TProductVariation } from '@/types/wcRestApi'
import { useState, useEffect } from 'react'
import { addedProductsAtom } from '../atoms'
import { useSetAtom } from 'jotai'

export type TResult<T> = {
  data: {
    data: T[]
  }
  isLoading: boolean
  isFetching: boolean
}

const useGetAddProducts = (shop_meta_product_ids: number[]) => {
  const [
    result,
    setResult,
  ] = useState<TResult<TProduct>>({
    data: {
      data: [],
    },
    isLoading: true,
    isFetching: true,
  })

  const setAddedProducts = useSetAtom(addedProductsAtom)

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      include: shop_meta_product_ids,
      status: 'publish',
      per_page: 100,
    },
    queryOptions: {
      enabled: shop_meta_product_ids.length > 0,
      staleTime: 1000 * 60 * 15,
      cacheTime: 1000 * 60 * 15,
    },
  })

  const products = (productsResult?.data?.data || []) as TProduct[]

  useEffect(() => {
    if (!productsResult.isLoading && productsResult.isSuccess) {
      Promise.all(
        products.map(async (product) => {
          if (product?.type !== 'variable' && !product?.productVariations) return await product
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
          setAddedProducts(res)
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

  useEffect(() => {
    if (shop_meta_product_ids.length === 0) {
      setResult({
        data: {
          data: [],
        },
        isLoading: false,
        isFetching: false,
      })
    }
  }, [shop_meta_product_ids.length])

  // productsResult!.data!.data = Promise.all(formattedProducts)

  return result
}

export default useGetAddProducts
