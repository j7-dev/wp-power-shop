import { useState } from 'react'
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons'
import { Space, Tag, Form, Input } from 'antd'
import { TProduct, TProductVariation } from '@/types/wcRestApi'
import { getProductImageSrc, getProductTypeLabel, renderHTML } from '@/utils'
import { FSMetaAtom } from '../../atoms'
import { useAtomValue } from 'jotai'
import { useMany } from '@/hooks'
import Variation from './Variation'
import RemoveIcon from '../RemoveIcon'

const Variable: React.FC<{
  product: TProduct
  index: number
}> = ({ product, index }) => {
  const [
    isExpended,
    setIsExpended,
  ] = useState(false)
  const FSMeta = useAtomValue(FSMetaAtom)
  const id = product?.id ?? 0
  const matchProduct = FSMeta.find((item) => item.productId === id)
  const name = renderHTML(product?.name ?? '未知商品')
  const type = product?.type ?? ''
  const imageSrc = getProductImageSrc(product)
  const categories = product?.categories ?? []
  const variations = product?.variations ?? []

  const productVariationsResult = useMany({
    resource: `products/${id}/variations`,
    args: {
      per_page: 100,
    },
    dataProvider: 'wc',
    queryOptions: {
      enabled: variations.length > 0,
    },
  })

  const productVariations: TProductVariation[] = productVariationsResult?.data?.data ?? []

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-1 mr-4">
          <div className="mr-4">
            <img className="h-16 w-16 rounded-xl object-cover" src={imageSrc} />
            <p className="m-0 text-xs text-gray-400">{getProductTypeLabel(type)}</p>
            <p className="m-0 text-xs text-gray-400">ID: #{id}</p>
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
              <span className="underline text-blue-500 cursor-pointer mt-2 mb-4" onClick={() => setIsExpended(!isExpended)}>
                {isExpended ? <ShrinkOutlined className="mr-1" /> : <ArrowsAltOutlined className="mr-1" />}

                {isExpended ? '收起' : '展開'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <RemoveIcon productId={id} />
        </div>
      </div>
      <Form.Item
        name={[
          index,
          'productId',
        ]}
        initialValue={id}
        hidden>
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

      <div className={`pl-20 pr-8 ${isExpended ? 'block' : 'hidden'}`}>
        {productVariations.map((variation, i) => (
          <Variation key={variation?.id} variation={variation} parentIndex={index} parentId={id} index={i} matchProduct={matchProduct} />
        ))}
      </div>

      <hr className="mt-4 mb-8" />
    </>
  )
}

export default Variable
