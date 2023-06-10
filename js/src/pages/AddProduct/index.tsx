import { useEffect, useRef } from 'react'
import { Form, Alert } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtom } from 'jotai'
import { getQueryString } from '@/utils'
import { useOne, useMany } from '@/hooks'
import { TFastShopMeta } from '@/types'
import { sortBy } from 'lodash-es'
import { LoadingWrap, LoadingCard } from '@/components/PureComponents'

const AddProduct = () => {
  const postId = getQueryString('post')
  const postResult = useOne({
    resource: `fast-shop/${postId}`,
    queryOptions: {
      enabled: !!postId,
    },
  })
  const post = postResult?.data?.data || {}
  const fast_shop_meta = JSON.parse(
    post?.meta?.fast_shop_meta || '[]',
  ) as TFastShopMeta[]
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
    const allFields_obj = form.getFieldsValue()
    const allFields = Object.values(allFields_obj) as TFastShopMeta[]
    const sortOrder = addedProducts.map((product) => product.id)
    const sortedAllFields = sortBy(allFields, (field) => {
      return sortOrder.indexOf(field.productId)
    })
    const input = testRef.current
    if (!input) return null
    input.value = JSON.stringify(sortedAllFields)
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
    <div className="">
      {postResult?.isLoading && <LoadingWrap />}
      <Form className="pt-4" layout="vertical" form={form}>
        <Alert
          className="mb-4"
          message="要在頁面使用這些商品，請使用 [fast_shop_product] 這個 shortcode"
          type="info"
          showIcon
        />
        {productsResult?.isLoading
          ? [
              1,
              2,
              3,
            ].map((i) => <LoadingCard ratio="h-[8rem]" key={i} />)
          : addedProducts.map((product, i) => (
              <AddedItem key={product?.id} product={product} index={i} />
            ))}

        <Add />
        <input ref={testRef} type="hidden" name="fast_shop_meta" value="" />
      </Form>
    </div>
  )
}

export default AddProduct
