import Simple from './Simple'
import Variable from './Variable'
import { TProduct } from '@/types'

const AddedItem: React.FC<{
  product: TProduct
  index: number
}> = ({ product, index }) => {
  const type = product?.type ?? ''

  if (type === 'simple') {
    return <Simple product={product} index={index} />
  }

  if (type === 'variable') {
    return <Variable product={product} index={index} />
  }

  return null
}

export default AddedItem
