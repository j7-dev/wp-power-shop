import { useContext } from 'react'
import Simple from './Simple'
import Variable from './Variable'
import { ProductsContext } from '@/pages/PowerShopProducts/Main'

const Item: React.FC<{ productId: number }> = ({ productId }) => {
  const { products } = useContext(ProductsContext)
  const product = products.find((p) => p.id === productId)
  const type = product?.type ?? ''

  return (
    <>
      {type === 'simple' && !!product && <Simple product={product} />}
      {type === 'variable' && !!product && <Variable product={product} />}
    </>
  )
}

export default Item
