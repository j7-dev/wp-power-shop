import { Form } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtomValue } from 'jotai'

const AddProduct = () => {
  const addedProducts = useAtomValue(addedProductsAtom)
  const [form] = Form.useForm()
  return (
    <Form className="pt-8" layout="vertical" form={form}>
      {addedProducts.map((product) => (
        <AddedItem key={product?.id} product={product} />
      ))}
      <Add />
    </Form>
  )
}

export default AddProduct
