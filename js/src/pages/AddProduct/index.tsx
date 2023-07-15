import { useEffect, useRef } from 'react'
import { Form, Alert } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom, FSMetaAtom } from './atoms'
import { useAtom, useSetAtom } from 'jotai'
import { postId } from '@/utils'
import { useMany, useAjaxGetPostMeta } from '@/hooks'
import { TFSMeta } from '@/types'
import { sortBy } from 'lodash-es'
import { LoadingWrap, LoadingCard } from '@/components/PureComponents'

// FIXME: 順序好像會有問題

const AddProduct = () => {
  const setFSMeta = useSetAtom(FSMetaAtom)

  const mutation = useAjaxGetPostMeta<TFSMeta[]>({
    post_id: postId,
    meta_key: 'fast_shop_meta',
    formatter: (post_meta: string) => JSON.parse(post_meta || '[]'),
  })
  const fast_shop_meta = mutation?.meta ?? []

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
  const ref = useRef<HTMLInputElement>(null)

  const handleSave = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const postForm = document.getElementById('post') as HTMLFormElement | null
    const allFields_obj = form.getFieldsValue()
    const allFields = Object.values(allFields_obj) as TFSMeta[]
    const sortOrder = addedProducts.map((product) => product.id)
    const sortedAllFields = sortBy(allFields, (field) => {
      return sortOrder.indexOf(field.productId)
    })
    const input = ref.current
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
      setFSMeta(fast_shop_meta)
    }
  }, [productsResult?.isLoading])

  return (
    <div className="">
      {mutation?.isLoading && <LoadingWrap />}
      <Form className="pt-4" layout="vertical" form={form}>
        <Alert
          className="mb-4"
          message="要在頁面使用這些商品，請使用 [fast_shop_product] 這個 shortcode"
          type="info"
          showIcon
        />
        {productsResult?.isLoading && productsResult?.isFetching
          ? [
              1,
              2,
              3,
            ].map((i) => <LoadingCard ratio="h-[8rem]" key={i} />)
          : addedProducts.map((product, i) => (
              <AddedItem key={product?.id} product={product} index={i} />
            ))}

        <Add />
        <input ref={ref} type="hidden" name="fast_shop_meta" value="" />
      </Form>
    </div>
  )
}

export default AddProduct
