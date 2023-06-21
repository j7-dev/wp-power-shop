import React from 'react'
import { Button } from 'antd'
import { useAdminAjax } from '@/hooks'
import { ajaxNonce } from '@/utils'
import { AxiosResponse } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

const AddToCartButton: React.FC<{
  productId: number
  quantity: number
  variation?: {
    attribute: string
    value: string
  }[]
}> = (props) => {
	const queryClient = useQueryClient()
  const { mutate } = useAdminAjax()
  const handleClick = () => {
    mutate({
      action: 'handle_cart_price',
      nonce: ajaxNonce,
      id: props.productId,
      quantity: props.quantity,
      variation: props?.variation,
    },{
			onSuccess: (data :AxiosResponse) => {
				console.log(data?.data)
				queryClient.invalidateQueries({ queryKey: ['get_cart'] })
			}
		})
  }
  return (
    <Button className="w-full mt-4" type="primary" onClick={handleClick}>
      加入購物車
    </Button>
  )
}

export default AddToCartButton
