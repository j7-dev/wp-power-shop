import React from 'react'
import { Button, notification } from 'antd'
import { useAjax } from '@/hooks'
import { ajaxNonce, postId } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'

const AddToCartButton: React.FC<{
  productId: number
  quantity: number
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  variation?: any[]
  variationId?: number | null
}> = (props) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useAjax()
  const [
    api,
    contextHolder,
  ] = notification.useNotification()

  const handleClick = () => {
    mutate(
      {
        action: 'handle_add_cart',
        nonce: ajaxNonce,
        post_id: postId,
        id: props.productId,
        quantity: props.quantity,
        variation: JSON.stringify(props?.variation ?? []),
        variation_id: props?.variationId ?? '',
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
        disabled={!props?.variationId}
      >
        加入購物車
      </Button>
    </>
  )
}

export default AddToCartButton
