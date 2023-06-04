import { useEffect } from 'react'
import { Form } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtomValue } from 'jotai'
import { setFormData } from '@/utils'

const AddProduct = () => {
  const addedProducts = useAtomValue(addedProductsAtom)
  const [form] = Form.useForm()

  const handleSetFormData = () => {
    const allFields = form.getFieldsValue()
    setFormData({
      key: 'fast_shop_meta',
      value: allFields,
    })
  }

  useEffect(() => {
    const saveBtn = document.querySelector(
      '#publishing-action input[type="submit"]',
    )
    const postForm = document.getElementById('post') as HTMLFormElement | null
    const handleSave = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      handleSetFormData()
      if (!postForm) return null

      // postForm.submit()
    }
    if (!!saveBtn) {
      saveBtn.addEventListener('click', handleSave)
    }
    return () => {
      if (!!saveBtn) {
        saveBtn.removeEventListener('click', handleSave)
      }
    }
  }, [])

  return (
    <Form
      className="pt-8"
      layout="vertical"
      form={form}
      onFieldsChange={handleSetFormData}
    >
      {addedProducts.map((product, i) => (
        <AddedItem key={product?.id} product={product} index={i} />
      ))}
      <Add />
    </Form>
  )
}

export default AddProduct
