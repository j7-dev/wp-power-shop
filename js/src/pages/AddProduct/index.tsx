/* eslint-disable no-lonely-if */
import { useEffect, useRef, useCallback } from 'react'
import { Form, Alert, Typography, notification } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom, FSMetaAtom, isChangeAtom } from './atoms'
import { useAtom, useSetAtom } from 'jotai'
import { postId, snake, formatShopMeta, isUsingBlockEditor } from '@/utils'
import { useMany, useAjaxGetPostMeta } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct } from '@/types/wcRestApi'
import { sortBy } from 'lodash-es'
import { LoadingWrap, LoadingCard } from '@/components/PureComponents'
import SaveButton from './SaveButton'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import SettingButton from './SettingButton'
import { SaveFilled } from '@ant-design/icons'

const { Paragraph } = Typography
const tinyMCESaveBtn = document.getElementById('publish') as HTMLInputElement | null
const blockEditorSaveBtn = document.querySelector('.editor-post-publish-button') as HTMLInputElement | null

const AddProduct = () => {
  const [
    isChange,
    setIsChange,
  ] = useAtom(isChangeAtom)
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

  const handleTinyMCESave = (e: Event) => {
    // 按下傳統編輯器的儲存按鈕的 callback

    e.preventDefault()
    e.stopPropagation()

    const postForm = document.getElementById('post') as HTMLFormElement | null

    const sortedAllFields = formatShopMeta({
      form,
    })
    const input = ref.current
    if (!input) return null
    input.value = JSON.stringify(sortedAllFields)
    postForm?.prepend(input)
    if (!postForm || !tinyMCESaveBtn) return null

    const hidden_post_status = document.getElementById('hidden_post_status') as HTMLInputElement | null

    // 原本發布後，TINYMCE狀態還是會一直停在草稿，所以要改成發布

    if (hidden_post_status?.value === 'draft') {
      const newOption = document.createElement('option')
      newOption.value = 'publish'
      newOption.textContent = 'Publish'
      const select = document.getElementById('post_status') as HTMLSelectElement | null
      if (select) {
        select.appendChild(newOption)
      }
      newOption.selected = true
    }

    postForm.submit()
  }

  const handleBlockEditorSave = () => {
    // Form 改變時，寫入自訂欄位

    if (isUsingBlockEditor) {
      const fields = [
        'power_shop_meta',
        'power_shop_report_password',
        'power_shop_settings',
      ]
      const metaIds = window?.appData?.metaIds
      if (metaIds) {
        fields.forEach((field) => {
          const mid = metaIds[field as keyof typeof metaIds]
          const fieldNode = document.getElementById(`meta-${mid}-value`) as HTMLInputElement | null
          if (field === 'power_shop_meta' && fieldNode) {
            const sortedAllFields = formatShopMeta({
              form,
            })
            fieldNode.value = JSON.stringify(sortedAllFields)
          }
        })
      }
    }
  }

  useEffect(() => {
    if (!!tinyMCESaveBtn) {
      tinyMCESaveBtn.addEventListener('click', handleTinyMCESave)
    }
    return () => {
      if (!!tinyMCESaveBtn) {
        tinyMCESaveBtn.removeEventListener('click', handleTinyMCESave)
      }
    }
  }, [isUsingBlockEditor])

  useEffect(() => {
    if (!productsResult?.isFetching && !mutation?.isLoading) {
      const products = (productsResult?.data?.data || []) as TProduct[]

      // 排序

      const sortOrder = shop_meta.map((m) => m.productId)
      const sortedProducts = sortBy(products, (p) => {
        return sortOrder.indexOf(p.id)
      })

      setAddedProducts(sortedProducts)
      setFSMeta(shop_meta)

      // 載入完成後，啟用儲存按鈕

      if (tinyMCESaveBtn) tinyMCESaveBtn.disabled = false
      if (blockEditorSaveBtn) blockEditorSaveBtn.disabled = false
    } else {
      // 載入完成前，禁用儲存按鈕

      if (tinyMCESaveBtn) tinyMCESaveBtn.disabled = true
      if (blockEditorSaveBtn) blockEditorSaveBtn.disabled = true
    }
  }, [
    mutation?.isLoading,
    productsResult?.isFetching,
  ])

  const handleFormChange = () => {
    setIsChange(true)
    handleBlockEditorSave()
  }

  useEffect(() => {
    if (isChange) {
      notification.config({
        maxCount: 1,
      })
      notification.warning({
        key: 'saveNotification',
        message: '偵測到變更，記得儲存！',
        duration: null,
        placement: 'bottomRight',
      })
    } else {
      notification.destroy('saveNotification')
    }
  }, [isChange])

  useEffect(() => {
    handleBlockEditorSave()
  }, [addedProducts.length])

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setAddedProducts((pre: TProduct[]) =>
      update(pre, {
        $splice: [
          [
            dragIndex,
            1,
          ],
          [
            hoverIndex,
            0,
            pre[dragIndex] as TProduct,
          ],
        ],
      }),
    )
  }, [])

  const renderItem = useCallback((product: TProduct, index: number) => {
    return <AddedItem key={product.id} index={index} product={product} moveCard={moveCard} />
  }, [])

  return (
    <div className="p-4">
      {mutation?.isLoading && <LoadingWrap />}
      <Form className="pt-4" layout="vertical" form={form} onValuesChange={handleFormChange}>
        <div className="flex justify-between mb-4">
          <SettingButton />
          <SaveButton type="primary" icon={<SaveFilled />} disabled={mutation?.isLoading || productsResult?.isFetching} />
        </div>
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
        <DndProvider backend={HTML5Backend}>
          {productsResult?.isLoading && productsResult?.isFetching
            ? [
                1,
                2,
                3,
              ].map((i) => <LoadingCard ratio="h-[8rem]" key={i} />)
            : addedProducts.map((product, i) => renderItem(product, i))}
        </DndProvider>

        <Add />
        <input ref={ref} type="hidden" name={`${snake}_meta`} value="" />
      </Form>
    </div>
  )
}

export default AddProduct
