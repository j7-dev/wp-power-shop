import { useEffect, useRef } from 'react'
import { Form, Alert, Typography } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom, FSMetaAtom } from './atoms'
import { useAtom, useSetAtom } from 'jotai'
import { postId, snake } from '@/utils'
import { useMany, useAjaxGetPostMeta } from '@/hooks'
import { TFSMeta } from '@/types'
import { sortBy } from 'lodash-es'
import { LoadingWrap, LoadingCard } from '@/components/PureComponents'

// FIXME: 順序好像會有問題

const { Paragraph } = Typography
const saveBtn = document.getElementById('publish') as HTMLInputElement | null

const AddProduct = () => {
  const setFSMeta = useSetAtom(FSMetaAtom)

  const mutation = useAjaxGetPostMeta<TFSMeta[]>({
    post_id: postId,
    meta_key: `${snake}_meta`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '[]'),
  })
  const shop_meta = mutation?.meta ?? []

  const shop_meta_product_ids = shop_meta.map((item) => item.productId)

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      include: shop_meta_product_ids,
    },
    queryOptions: {
      enabled: shop_meta_product_ids.length > 0,
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
    if (!postForm || !saveBtn) return null

    const hidden_post_status = document.getElementById(
      'hidden_post_status',
    ) as HTMLInputElement | null

    if (hidden_post_status?.value === 'draft') {
      const newOption = document.createElement('option')
      newOption.value = 'publish'
      newOption.textContent = 'Publish'
      const select = document.getElementById(
        'post_status',
      ) as HTMLSelectElement | null
      if (select) {
        select.appendChild(newOption)
      }
      newOption.selected = true
    }

    postForm.submit()
  }

  useEffect(() => {
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
      setFSMeta(shop_meta)
    }
  }, [productsResult?.isLoading])

  return (
    <div className="p-4">
      {mutation?.isLoading && <LoadingWrap />}
      <Form className="pt-4" layout="vertical" form={form}>
        <Alert
          className="mb-4"
          message={
            <div className="flex">
              要在頁面使用這些商品，請使用
              <Paragraph className="mx-4 my-0" copyable>
                {`[${snake}_products]`}
              </Paragraph>{' '}
              這個 shortcode，在快速商店以外使用這個 shortcode 是沒有作用的
            </div>
          }
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
        <input ref={ref} type="hidden" name={`${snake}_meta`} value="" />
      </Form>
    </div>
  )
}

export default AddProduct
