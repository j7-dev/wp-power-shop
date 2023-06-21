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
  console.log('🚀 ~ file: index.tsx:13 ~ Cart ~ cartResult:', cartResult)
	const wcStoreApiNonce = cartResult?.data?.headers?.['x-wc-store-api-nonce'] || ''

	useEffect(() => {
		setStoreApiNonce(wcStoreApiNonce)
	}, [wcStoreApiNonce])


  return <div>index</div>
}

export default Cart
