import { useEffect, useRef } from 'react'
import { Form } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtomValue } from 'jotai'

const AddProduct = () => {
  const addedProducts = useAtomValue(addedProductsAtom)
  const [form] = Form.useForm()
  const testRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saveBtn = document.querySelector(
      '#publishing-action input[type="submit"]',
    )
    const postForm = document.getElementById('post') as HTMLFormElement | null

    const handleSave = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      const allFields = form.getFieldsValue()
      const input = testRef.current
      if (!input) return null
      input.value = JSON.stringify(allFields)
      postForm?.prepend(input)
      if (!postForm) return null
      postForm.submit()
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
    <Form className="pt-8" layout="vertical" form={form}>
      {addedProducts.map((product, i) => (
        <AddedItem key={product?.id} product={product} index={i} />
      ))}
      <Add />
      <input ref={testRef} type="hidden" name="fast_shop_meta" value="" />
    </Form>
  )
}

export default AddProduct
