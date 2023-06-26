import React from 'react'
import { Button, notification } from 'antd'
import { useAdminAjax } from '@/hooks'
import { ajaxNonce } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'

const AddToCartButton: React.FC<{
  productId: number
  quantity: number
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  variation?: any[]
  variationId?: number | null
}> = (props) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useAdminAjax()
  const [
    api,
    contextHolder,
  ] = notification.useNotification()
  const handleClick = () => {
    mutate(
      {
        action: 'handle_add_cart',
        nonce: ajaxNonce,
        id: props.productId,
        quantity: props.quantity,
        variation: JSON.stringify(props?.variation ?? []),
        variation_id: props?.variationId ?? undefined,
      },
      {
        onSuccess: () => {
          props.setIsModalOpen(false)
          api.success({
            message: '加入購物車成功',
          })
          queryClient.invalidateQueries({ queryKey: ['get_cart'] })
        },
        onError: (error) => {
          console.log('Error', error)
          api.error({
            message: '加入購物車失敗',
          })
        },
      },
    )
  }
  return (
    <>
      {contextHolder}
      <Button
        className="w-full mt-4"
        type="primary"
        onClick={handleClick}
        loading={isLoading}
      >
        加入購物車
      </Button>
    </>
  )
}

export default AddToCartButton
