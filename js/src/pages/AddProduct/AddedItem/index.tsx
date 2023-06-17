import Simple from './Simple'
import Variable from './Variable'
import { TProduct } from '@/types/wcRestApi'

const AddedItem: React.FC<{
  product: TProduct
  index: number
}> = ({ product, index }) => {
  const type = product?.type ?? ''

  return (
    <>
      {type === 'simple' && <Simple product={product} index={index} />}
      {type === 'variable' && <Variable product={product} index={index} />}
    </>
  )
}

export default AddedItem
