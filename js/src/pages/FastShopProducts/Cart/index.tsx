import { useEffect } from 'react'
import { useOne } from '@/hooks'
import { useSetAtom } from 'jotai'
import { storeApiNonceAtom } from '../atom'


const Cart = () => {
	const setStoreApiNonce = useSetAtom(storeApiNonceAtom)
  const cartResult = useOne({
    resource: 'cart',
    dataProvider: 'wc-store',
  })
	const wcStoreApiNonce = cartResult?.data?.headers?.['x-wc-store-api-nonce'] || ''
	const cartData = cartResult?.data?.data || {}
	const items = cartData?.items || []
  console.log('🚀 ~ file: index.tsx:13 ~ Cart ~ data:', cartData)


	useEffect(() => {
		setStoreApiNonce(wcStoreApiNonce)
	}, [wcStoreApiNonce])


  return <div>
		{items.map((item: any) => {
			return <p key={item?.key}>
				{item?.name} {item?.quantity}
			</p>
		})}
	</div>
}

export default Cart
