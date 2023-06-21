import React from 'react'
import { Button } from 'antd'
import { useAdminAjax } from '@/hooks'
import { ajaxNonce, ajaxAction } from '@/utils'

const AddToCartButton: React.FC<{
  productId: number
  quantity: number
  variation?: {
    attribute: string
    value: string
  }[]
}> = (props) => {
  const { mutate } = useAdminAjax()
  const handleClick = () => {
    mutate({
      action: ajaxAction,
      nonce: ajaxNonce,
      id: props.productId,
      quantity: props.quantity,
      variation: props?.variation,
    })
  }
  return (
    <Button className="w-full mt-4" type="primary" onClick={handleClick}>
      加入購物車
    </Button>
  )
}

export default AddToCartButton
