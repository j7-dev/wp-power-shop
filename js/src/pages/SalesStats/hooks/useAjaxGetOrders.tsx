import { useState, useEffect } from 'react'
import { useAjax } from '@/hooks'
import { ajaxNonce } from '@/utils'

type TProps = {
  post_id: string
}

export function useAjaxGetOrders<T>(props?: TProps) {
  const [
    orderData,
    setOrderData,
  ] = useState<T | undefined>(undefined)
  const post_id = props?.post_id || '0'
  const mutation = useAjax()
  const { mutate } = mutation

  useEffect(() => {
    mutate(
      {
        action: 'handle_get_orders',
        nonce: ajaxNonce,
        post_id,
      },
      {
        onSuccess: (res) => {
          const fetchedData = res?.data?.data || ({} as T)

          setOrderData(fetchedData)
        },
        onError: (error) => {
          console.log(error)
        },
      },
    )
  }, [])

  return {
    ...mutation,
    orderData,
  }
}
