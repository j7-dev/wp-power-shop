import { FC } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { useAtom, useSetAtom } from 'jotai'
import { addedProductsAtom, isChangeAtom } from '../atoms'
import { Form } from 'antd'
import { TPSMeta } from '@/types'

const RemoveIcon: FC<{ productId: number }> = ({ productId }) => {
  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)
  const setIsChange = useSetAtom(isChangeAtom)
  const form = Form.useFormInstance()

  const handleRemoveProduct = () => {
    const newAddedProducts = addedProducts.filter((item) => item.id !== productId)
    setAddedProducts(newAddedProducts)
    setIsChange(true)

    // 同時也要改變表單順序
    const values = form.getFieldsValue() // 舊的
    const valuesInArray: TPSMeta[] = Object.values(values)
    const newValuesInArray = valuesInArray.filter((item) => item.productId !== productId)
    form.setFieldsValue(newValuesInArray)
  }

  return <CloseCircleFilled className="text-red-500 text-2xl cursor-pointer" onClick={handleRemoveProduct} />
}

export default RemoveIcon
