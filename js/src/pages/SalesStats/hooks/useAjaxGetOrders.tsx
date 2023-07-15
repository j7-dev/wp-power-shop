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
  is_download?: 1 | 0
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
  const rangePicker = props?.rangePicker || undefined
  const status = props?.status || undefined
  const is_download = props?.is_download || 0
  const mutation = useAjax()
  const { mutate } = mutation

  useEffect(() => {
    if (status) {
      let date_created = ''
      if (rangePicker) {
        date_created = `${rangePicker[0].format(
          'YYYY-MM-DD',
        )}...${rangePicker[1].format('YYYY-MM-DD')}`
      }

      const payload = {
        action: 'handle_get_orders',
        nonce: ajaxNonce,
        post_id,
        paged,
        limit,
        status: JSON.stringify(status),
        email,
        date_created,
        is_download,
      }

      mutate(payload, {
        onSuccess: (res) => {
          const fetchedData = res?.data?.data || ({} as T)
          setOrderData(fetchedData)
        },
        onError: (error) => {
          console.log(error)
        },
      })
    }
  }, [
    post_id,
    paged,
    limit,
    status,
    email,
    rangePicker,
    is_download,
  ])

  return {
    ...mutation,
    orderData,
  }
}
