import React from 'react'
import { Button } from 'antd'
import { useUpdate } from '@/hooks'
import { useAtomValue } from 'jotai'
import { storeApiNonceAtom } from '@/pages/FastShopProducts/atom'

const AddToCartButton: React.FC<{
  productId: number
  quantity: number
  variation?: {
    attribute: string
    value: string
  }[]
}> = (props) => {
	const nonce = useAtomValue(storeApiNonceAtom)
  const { mutate } = useUpdate({
    resource: 'cart/add-item',
    dataProvider: 'wc-store',
		config: {
			headers: {
				'Nonce': nonce,
			}
		}
  })
  const handleClick = () => {
    mutate({
      id: props.productId,
      quantity: props.quantity,
      variation: props.variation,
    })
  }
  return (
    <Button className="w-full mt-4" type="primary" onClick={handleClick}>
      加入購物車
    </Button>
  )
}

export default AddToCartButton
