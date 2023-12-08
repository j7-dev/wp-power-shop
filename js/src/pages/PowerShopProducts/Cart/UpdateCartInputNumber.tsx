/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect } from 'react'
import { InputNumber, notification } from 'antd'
import { useUpdate } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { storeApiNonceAtom, TCartItem, cartDataAtom, TCartData } from '../atom'
import { useAtomValue, useAtom } from 'jotai'

const DELAY = 700

const UpdateCartInputNumber: React.FC<{ item: TCartItem }> = ({ item }) => {
  const qtyInCart = item?.quantity || 1
  const [
    cartData,
    setCartData,
  ] = useAtom(cartDataAtom)

  const stockQty = findStockQtyById(item.id)

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
      onMutate: (variables) => {
        setCartData((prev) => ({
          ...prev,
          isMutating: true,
          items: prev.items.map((i) => {
            if (i.key === variables.key) {
              return {
                ...i,
                isMutating: true,
              }
            }
            return i
          }),
        }))

        const rollBack = cartData.items.find((i) => i.key === variables.key)
        if (rollBack) {
          return {
            ...rollBack,
            quantity: rollBack.quantity_raw,
          }
        }
      },
      onSuccess: () => {
        // api.success({
        //   message: '修改購物車成功',
        // })

        queryClient.invalidateQueries({ queryKey: ['get_cart'] })
      },
      onError: (error: any, _variables, rollBack) => {
        console.log('Error', error)
        api.error({
          message: error?.response?.data?.message || '修改購物車失敗',
        })
        setCartData((prev) => ({
          ...prev,
          isMutating: false,
          items: prev.items.map((i) => {
            if (i.key === (rollBack as TCartItem).key) {
              return rollBack as TCartItem
            }
            return i
          }),
        }))
      },
    },
    config: {
      headers: {
        Nonce: storeApiNonce,
      },
    },
  })

  const handleDecrement = async () => {
    setCartData(handleMutate('DECREMENT'))
  }

  const handleIncrement = async () => {
    setCartData(handleMutate('INCREMENT'))
  }

  const handleChange = async (v: number | null) => {
    if (v) {
      setCartData(handleMutate(v))
    }
  }

  const handleMutate =
    (v: number | null | 'INCREMENT' | 'DECREMENT'): ((_: TCartData) => TCartData) =>
    (prev: TCartData) => {
      const findSameItem = prev.items.find((i) => i.key === key)
      if (findSameItem) {
        return {
          ...prev,
          items: prev.items.map((i) => {
            if (i.key === key) {
              const theQuantity = getQuantity(v, i, stockQty)
              return {
                ...i,
                quantity: theQuantity,
              }
            }
            return i
          }),
        }
      }
      return prev
    }

  useEffect(() => {
    if (qtyInCart !== item?.quantity_raw) {
      const timer = setTimeout(() => {
        mutate({
          key,
          quantity: qtyInCart,
        })
      }, DELAY)

      return () => clearTimeout(timer)
    }
  }, [
    qtyInCart,
  ])

  return (
    <>
      {contextHolder}
      <InputNumber
        className="w-full"
        min={1}
        max={stockQty}
        addonBefore={
          <span className="ps-addon" onClick={handleDecrement}>
            -
          </span>
        }
        addonAfter={
          <span className="ps-addon" onClick={handleIncrement}>
            +
          </span>
        }
        value={qtyInCart}
        onChange={handleChange}
      />
    </>
  )
}

function getQuantity(value: number | null | 'INCREMENT' | 'DECREMENT', theItem: TCartItem, stockQty: number) {
  const currentQty = Number(theItem.quantity)
  switch (value) {
    case 'DECREMENT':
      return currentQty <= 1 ? 1 : currentQty - 1
    case 'INCREMENT':
      return currentQty >= stockQty ? stockQty : currentQty + 1
    case null:
      return 1
    default:
      return value >= stockQty ? stockQty : value
  }
}

function findStockQtyById(id: number) {
  const findProduct = window.appData.products_info.products.find((p) => p.id === id)
  if (findProduct) {
    const stock = findProduct?.stock
    return stock?.stockQuantity ?? Infinity
  }
  const allVariations = window.appData.products_info.products.flatMap((p) => p?.variations).filter((v) => !!v)
  const findVariation = allVariations.find((v) => v?.variation_id === id)
  if (findVariation) {
    const stock = findVariation?.stock
    return stock?.stockQuantity ?? Infinity
  }
  return Infinity
}

export default UpdateCartInputNumber
