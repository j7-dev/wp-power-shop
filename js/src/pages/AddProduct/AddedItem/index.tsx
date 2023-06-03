import Simple from './Simple'
import Variable from './Variable'
import { TProduct } from '@/types'

const AddedItem: React.FC<{
  product: TProduct
}> = ({ product }) => {
  const type = product?.type ?? ''

  if (type === 'simple') {
    return <Simple product={product} />
  }

  if (type === 'variable') {
    return <Variable product={product} />
  }

  return null
}

export default AddedItem
