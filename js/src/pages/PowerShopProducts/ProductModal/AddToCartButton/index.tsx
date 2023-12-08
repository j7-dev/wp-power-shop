import React from 'react'
import { Button, notification } from 'antd'
import { useAjax } from '@/hooks'
import { ajaxNonce, postId, showConfetti } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { isProductModalOpenAtom, selectedVariationIdAtom, selectedAttributesAtom, shopStatusAtom, cartDataAtom, TCartItem, TShopStatus } from '@/pages/PowerShopProducts/atom'
import { useSetAtom, useAtomValue, useAtom } from 'jotai'
import { TAjaxProduct } from '@/types/custom'
import { nanoid } from 'nanoid'
import { TProductVariationAttribute } from '@/types/wcStoreApi'
import confetti from 'canvas-confetti'
import { getStockQty } from '@/utils/custom'

const AddToCartButton: React.FC<{
  product: TAjaxProduct
  quantity: number
}> = ({ product, quantity }) => {
  const queryClient = useQueryClient()
  const setIsProductModalOpen = useSetAtom(isProductModalOpenAtom)
  const [
    cartData,
    setCartData,
  ] = useAtom(cartDataAtom)
  const productId = product?.id

  const { mutate } = useAjax({
    mutationOptions: {
      onMutate: (variables) => {
        api.success({
          key: 'cart_add',
          message: (
            <div>
              <p className="m-0">加入購物車成功</p>
              <p
                className="m-0 cursor-pointer text-primary"
                onClick={() => {
                  const cartTable = document.getElementById('ps-cart-table')
                  if (!cartTable) return
                  cartTable.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}>
                前往購物車
              </p>
            </div>
          ),
        })
        if (showConfetti) {
          const defaultArgs = {
            particleCount: 100,
            scalar: 0.6,
            ticks: 60,
            startVelocity: 70,
            spread: 360,
            origin: { x: randomInRange(0.1, 0.9), y: randomInRange(-0.2, 0.8) },
          }
          for (let index = 0; index < 3; index++) {
            confetti(defaultArgs)
          }
        }

        const variation_id = variables.variation_id
        const { id, name, short_description, description, images } = product
        const variation = JSON.parse(variables.variation as string) as TProductVariationAttribute[]

        setIsProductModalOpen(false)

        const newCartItem: TCartItem = {
          key: nanoid(),
          id: variation_id ? Number(variation_id) : id,
          quantity,
          quantity_raw: quantity,
          name,
          short_description,
          description,
          images: images.map((src) => ({
            src,
          })),
          variation: variation
            ? variation.map((item) => ({
                attribute: item.name,
                value: item.value,
              }))
            : [],
          isMutating: true,
        }

        setCartData((prev) => {
          const findSameItem = prev.items.find((i) => i.id === newCartItem.id && JSON.stringify(i.variation) === JSON.stringify(newCartItem.variation))

          if (findSameItem) {
            return {
              ...prev,
              isMutating: true,
              items: prev.items.map((i) => {
                if (i.id === newCartItem.id && JSON.stringify(i.variation) === JSON.stringify(newCartItem.variation)) {
                  return {
                    ...i,
                    quantity: Number(i.quantity) + Number(newCartItem.quantity),
                    quantity_raw: Number(i.quantity),
                    isMutating: true,
                  }
                }
                return i
              }),
            }
          }
          return {
            ...prev,
            isMutating: true,
            items: [
              ...prev.items,
              newCartItem,
            ],
          }
        })

        const rollBack = cartData.items.find((i) => i.id === newCartItem.id)
        return rollBack
      },
    },
  })
  const [
    api,
    contextHolder,
  ] = notification.useNotification()

  const selectedVariationId = useAtomValue(selectedVariationIdAtom)
  const selectedAttributes = useAtomValue(selectedAttributesAtom)
  const shopStatus = useAtomValue(shopStatusAtom)

  const handleClick = () => {
    mutate(
      {
        action: 'handle_add_cart',
        nonce: ajaxNonce,
        post_id: postId,
        id: productId,
        quantity,
        variation: JSON.stringify(selectedAttributes ?? []),
        variation_id: selectedVariationId ?? '',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['get_cart'] })
        },
        onError: (error: any, variables, rollBack) => {
          console.log('Error', error)
          api.error({
            key: 'cart_add',
            message: (
              <div>
                <p className="m-0">OOPS! 出了點問題</p>
                <p className="m-0">{error?.response?.data?.message || '加入購物車失敗'}</p>
              </div>
            ),
          })

          if (rollBack) {
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
          } else {
            setCartData((prev) => ({
              ...prev,
              isMutating: false,
              items: prev.items.filter((i) => i.id !== (variables.id as number)),
            }))
          }
        },
      },
    )
  }
  const stockQty = getStockQty(product, selectedVariationId)
  const cartItems = cartData?.items ?? []
  const qtyInCart = cartItems.find((item) => item.id === product?.id)?.quantity ?? 0
  const qtyAvailable = Number(stockQty) - Number(qtyInCart)

  return (
    <>
      {contextHolder}
      <Button className="w-full mt-4" type="primary" onClick={handleClick} disabled={!qtyAvailable || !canAddToCart(product, selectedVariationId, shopStatus, qtyInCart)}>
        加入購物車
      </Button>
    </>
  )
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function canAddToCart(product: TAjaxProduct, selectedVariationId: number | null, shopStatus: TShopStatus, qtyInCart: number) {
  if (shopStatus !== 'published') return false

  if (product.type === 'variable') {
    const variation = product?.variations?.find((v) => v.variation_id === selectedVariationId)
    const stockStatus = variation?.stock?.stockStatus
    return !!selectedVariationId && stockStatus !== 'outofstock'
  } else if (product.type === 'simple') {
    const stockStatus = product?.stock?.stockStatus
    return stockStatus !== 'outofstock'
  }
  return true
}

export default AddToCartButton
