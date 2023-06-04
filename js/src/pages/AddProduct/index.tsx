import { useEffect, useRef, useCallback } from 'react'
import { Form } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtom } from 'jotai'
import { getQueryString } from '@/utils'
import { useOne, useMany } from '@/hooks'
import { TFastShopMeta } from '@/types'

const AddProduct = () => {
  const postId = getQueryString('post')
  const postResult = useOne({
    resource: `fast-shop/${postId}`,
    queryOptions: {
      enabled: !!postId,
    },
  })
  const post = postResult?.data?.data || {}
  const fast_shop_meta_obj = JSON.parse(post?.meta?.fast_shop_meta || '{}')
  const fast_shop_meta = Object.values(fast_shop_meta_obj) as TFastShopMeta[]
  const fast_shop_meta_product_ids = fast_shop_meta.map(
    (item) => item.productId,
  )

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      include: fast_shop_meta_product_ids,
    },
    queryOptions: {
      enabled: fast_shop_meta_product_ids.length > 0,
    },
  })

  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)
  const [form] = Form.useForm()
  const testRef = useRef<HTMLInputElement>(null)

  const handleSave = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const postForm = document.getElementById('post') as HTMLFormElement | null
    const allFields = form.getFieldsValue()
    console.log('🚀 ~ file: index.tsx:50 ~ handleSave ~ allFields:', allFields)
    const input = testRef.current
    if (!input) return null
    input.value = JSON.stringify(allFields)
    postForm?.prepend(input)
    if (!postForm) return null

    postForm.submit()
  }

  useEffect(() => {
    const saveBtn = document.querySelector(
      '#publishing-action input[type="submit"]',
    )

    if (!!saveBtn) {
      saveBtn.addEventListener('click', handleSave)
    }
    return () => {
      if (!!saveBtn) {
        saveBtn.removeEventListener('click', handleSave)
      }
    }
  }, [])

  useEffect(() => {
    if (!productsResult?.isLoading) {
      const products = productsResult?.data?.data || []
      setAddedProducts(products)
    }
  }, [productsResult?.isLoading])

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
