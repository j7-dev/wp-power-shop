/* eslint-disable no-lonely-if */
import { useRef, useCallback } from 'react'
import { Form, Alert, Typography } from 'antd'
import Add from './Add'
import AddedItem from './AddedItem'
import { addedProductsAtom } from './atoms'
import { useAtom } from 'jotai'
import { snake } from '@/utils'
import { useMany } from '@/hooks'
import { TProduct } from '@/types/wcRestApi'
import { LoadingWrap, LoadingCard } from '@/components/PureComponents'
import SaveButton from './SaveButton'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import SettingButton from './SettingButton'
import { SaveFilled } from '@ant-design/icons'
import usePSMeta from './hooks/usePSMeta'
import useChangeNotification from './hooks/useChangeNotification'
import useAddProductSave from './hooks/useAddProductSave'

const { Paragraph } = Typography
export const tinyMCESaveBtn = document.getElementById('publish') as HTMLInputElement | null

// 因為發布與更新的 按鈕不同

export const blockEditorSaveBtn = document.querySelector('[class*="editor-post-publish-button"]') as HTMLInputElement | null
const metaId = window?.appData?.metaIds?.power_shop_meta
export const fieldNode = document.getElementById(`meta-${metaId}-value`) as HTMLInputElement | null

const AddProduct = () => {
  const { shop_meta, isLoading: isPSMetaLoading } = usePSMeta()

  const shop_meta_product_ids = shop_meta.map((item) => item.productId)

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      include: shop_meta_product_ids,
      status: 'publish',
    },
    queryOptions: {
      enabled: shop_meta_product_ids.length > 0,
      staleTime: 1000 * 60 * 15,
      cacheTime: 1000 * 60 * 15,
    },
  })

  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)

  const [form] = Form.useForm()
  const ref = useRef<HTMLInputElement>(null)

  const { handleSave: _ } = useAddProductSave({
    form,
    isPSMetaLoading,
    productsResult,
    shop_meta,
  })

  const { handleFormChange } = useChangeNotification(form)

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
      {isPSMetaLoading && <LoadingWrap />}
      <Form className="pt-4" layout="vertical" form={form} onValuesChange={handleFormChange}>
        <div className="flex justify-between mb-4">
          <SettingButton />
          <SaveButton type="primary" icon={<SaveFilled />} disabled={isPSMetaLoading || productsResult?.isFetching} />
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
