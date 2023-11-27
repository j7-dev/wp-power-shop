import React from 'react'
import { Button, notification } from 'antd'
import { useAjax } from '@/hooks'
import { ajaxNonce, postId } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { isProductModalOpenAtom, selectedVariationIdAtom, selectedAttributesAtom, shopStatusAtom, cartDataAtom, TCartItem } from '@/pages/PowerShopProducts/atom'
import { useSetAtom, useAtomValue, useAtom } from 'jotai'
import { TAjaxProduct, TPSMeta } from '@/types/custom'
import { nanoid } from 'nanoid'
import { TProductVariationAttribute } from '@/types/wcStoreApi'

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
  const productType = product?.type

  const { mutate, isLoading } = useAjax({
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
          // set isMutating to false

          // setCartData((prev) => {
          //   return {
          //     ...prev,
          //     items: prev.items.map((i) => {
          //       const variation = selectedAttributes.map((a) => ({
          //         attribute: a.name,
          //         value: a.value,
          //       }))

          //       if (i.id === productId && JSON.stringify(i.variation) === JSON.stringify(variation)) {
          //         return {
          //           ...i,
          //           isMutating: false,
          //         }
          //       }
          //       return i
          //     }),
          //   }
          // })

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

  return (
    <>
      {contextHolder}
      <Button className="w-full mt-4" type="primary" onClick={handleClick} disabled={(!selectedVariationId && productType === 'variable') || shopStatus !== 'published'}>
        加入購物車
      </Button>
    </>
  )
}

export default AddToCartButton
