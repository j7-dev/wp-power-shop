import { Form, Button } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtom } from 'jotai'

const AddProduct = () => {
  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)
  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      className="pt-8"
      layout="vertical"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {addedProducts.map((product) => (
        <AddedItem key={product?.id} product={product} />
      ))}
      <Add />
      <div className="flex justify-between mb-8">
        <Button
          size="large"
          className="mx-0"
          danger
          onClick={() => setAddedProducts([])}
        >
          刪除所有
        </Button>
        <Form.Item noStyle>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="mx-0"
          >
            儲存
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default AddProduct
