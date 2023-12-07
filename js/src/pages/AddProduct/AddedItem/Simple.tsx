import { Space, Tag, Form, InputNumber, Input } from 'antd'
import { TProduct } from '@/types/wcRestApi'
import { getProductImageSrc, getProductTypeLabel, renderHTML, showBuyerCount } from '@/utils'
import { PSMetaAtom } from '../atoms'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import RemoveIcon from './RemoveIcon'
import { TPSMeta } from '@/types'

const getPrices = (mp: TPSMeta | undefined, p: TProduct) => {
  const matchProductSalesPrice = Number(mp?.salesPrice ?? '0')
  const matchProductRegularPrice = Number(mp?.regularPrice ?? '0')

  if (!matchProductSalesPrice && !matchProductRegularPrice) {
    return {
      salesPrice: Number(p?.sale_price ?? '0'),
      regularPrice: Number(p?.regular_price ?? '0'),
    }
  }
  return {
    salesPrice: matchProductSalesPrice,
    regularPrice: matchProductRegularPrice,
  }
}

const Simple: React.FC<{
  product: TProduct
  index: number
}> = ({ product, index }) => {
  const PSMeta = useAtomValue(PSMetaAtom)
  const id = product?.id ?? 0
  const matchProduct = PSMeta.find((item) => item.productId === id)

  const name = renderHTML(product?.name ?? '未知商品')
  const imageSrc = getProductImageSrc(product)

  const { salesPrice, regularPrice } = getPrices(matchProduct, product)
  const extraBuyerCount = matchProduct?.extraBuyerCount || 0

  const categories = product?.categories ?? []
  const type = product?.type ?? ''
  const form = Form.useFormInstance()

  useEffect(() => {
    form.setFieldsValue({
      [index]: {
        productId: id,
        regularPrice,
        salesPrice,
        productType: type,
        extraBuyerCount,
      },
    })
  }, [
    id,
    index,
  ])

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-1 mr-4">
          <div className="mr-4">
            <img className="h-16 w-16 rounded-xl object-cover" src={imageSrc} />
            <p className="m-0 text-xs text-gray-400">{getProductTypeLabel(type)}</p>
            <p className="m-0 text-xs text-gray-400">ID: #{id}</p>
            <p className="m-0 text-xs text-gray-400">原價: {product?.regular_price ?? ''}</p>
            <p className="m-0 text-xs text-gray-400">特價: {product?.sale_price ?? ''}</p>
          </div>
          <div className="flex-1">
            <Space
              size={[
                0,
                8,
              ]}
              wrap>
              {categories.map((cat) => (
                <Tag key={cat?.id} color="#2db7f5">
                  {cat?.name}
                </Tag>
              ))}
            </Space>

            <div className="text-[1rem] mt-2 mb-0">{name}</div>
            <div className="flex">
              <Form.Item
                name={[
                  index,
                  'productId',
                ]}
                hidden
                initialValue={id}>
                <Input />
              </Form.Item>
              <Form.Item
                name={[
                  index,
                  'productType',
                ]}
                hidden
                initialValue={type}>
                <Input />
              </Form.Item>
              <Form.Item
                name={[
                  index,
                  'regularPrice',
                ]}
                label="原價"
                className="w-full mr-4">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name={[
                  index,
                  'salesPrice',
                ]}
                label="特價"
                className="w-full mr-4">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name={[
                  index,
                  'extraBuyerCount',
                ]}
                label="灌水購買人數"
                help="前台會顯示 真實購買人數 + 灌水購買人數"
                className="w-full"
                hidden={!showBuyerCount}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <RemoveIcon productId={id} />
        </div>
      </div>
      <hr className="mb-8" />
    </>
  )
}

export default Simple
