import { useState, useEffect } from 'react'
import { useAjax } from '@/hooks'
import { ajaxNonce } from '@/utils'
import { Dayjs } from 'dayjs'

type TProps = {
  post_id: string
  paged: number
  limit: number
  email?: string
  rangePicker?: Dayjs[]
  status?: string[]
}

export function useAjaxGetOrders<T>(props?: TProps) {
  const [
    orderData,
    setOrderData,
  ] = useState<T | undefined>(undefined)
  const post_id = props?.post_id || '0'
  const paged = props?.paged || 1
  const limit = props?.limit || 10
  const email = props?.email || ''
  const rangePicker = props?.rangePicker || []
  const status = props?.status || []
  const mutation = useAjax()
  const { mutate } = mutation

  useEffect(() => {
    mutate(
      {
        action: 'handle_get_orders',
        nonce: ajaxNonce,
        post_id,
        paged,
        limit,
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
  }, [
    post_id,
    paged,
    limit,
  ])

  return {
    ...mutation,
    orderData,
  }
}
