import Simple from './Simple'
import Variable from './Variable'
import { productsAtom } from '../atom'
import { useAtomValue } from 'jotai'

const Item: React.FC<{ productId: number }> = ({ productId }) => {
  const products = useAtomValue(productsAtom)
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
