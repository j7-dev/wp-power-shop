/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from 'react'
import { InputNumber, notification } from 'antd'
import { useUpdate } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { storeApiNonceAtom } from '../atom'
import { useAtomValue } from 'jotai'

const DELAY = 700

const UpdateCartInputNumber: React.FC<{ item: any }> = ({ item }) => {
  const [
    quantity,
    setQuantity,
  ] = useState(1)
  const [
    enabled,
    setEnabled,
  ] = useState(false)
  const queryClient = useQueryClient()
  const [
    api,
    contextHolder,
  ] = notification.useNotification()
  const storeApiNonce = useAtomValue(storeApiNonceAtom)
  const key = item?.key || ''
  const { mutate } = useUpdate({
    resource: 'cart/update-item',
    dataProvider: 'wc-store',
    mutationOptions: {
      onSuccess: () => {
        // api.success({
        //   message: '修改購物車成功',
        // })

        queryClient.invalidateQueries({ queryKey: ['get_cart'] })
        setEnabled(false)
      },
      onError: (error) => {
        console.log('Error', error)
        api.error({
          message: '修改購物車失敗',
        })
        setEnabled(false)
      },
    },
    config: {
      headers: {
        Nonce: storeApiNonce,
      },
    },
  })

  const handleDecrement = () => {
    setQuantity(quantity - 1)
    setEnabled(true)
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1)
    setEnabled(true)
  }

  const handleChange = (v: number | null) => {
    if (v) {
      setQuantity(v)
    } else {
      setQuantity(1)
    }
  }

  useEffect(() => {
    if (!!item?.quantity) {
      setQuantity(item?.quantity)
    }
  }, [item?.quantity])

  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(() => {
        mutate({
          key,
          quantity,
        })
      }, DELAY)

      return () => clearTimeout(timer)
    }
  }, [
    quantity,
    enabled,
  ])

  return (
    <>
      {contextHolder}
      <InputNumber
        className="w-full"
        addonBefore={
          <span className="fs-addon" onClick={handleDecrement}>
            -
          </span>
        }
        addonAfter={
          <span className="fs-addon" onClick={handleIncrement}>
            +
          </span>
        }
        value={quantity}
        onChange={handleChange}
      />
    </>
  )
}

export default UpdateCartInputNumber
