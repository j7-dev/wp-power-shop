import { FC } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { useAtom, useSetAtom } from 'jotai'
import { addedProductsAtom, isChangeAtom } from '../atoms'

const RemoveIcon: FC<{ productId: number }> = ({ productId }) => {
  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)
  const setIsChange = useSetAtom(isChangeAtom)

  const handleRemoveProduct = () => {
    const newAddedProducts = addedProducts.filter(
      (item) => item.id !== productId,
    )
    setAddedProducts(newAddedProducts)
    setIsChange(true)
  }

  return (
    <CloseCircleFilled
      className="text-red-500 text-2xl cursor-pointer"
      onClick={handleRemoveProduct}
    />
  )
}

export default RemoveIcon
