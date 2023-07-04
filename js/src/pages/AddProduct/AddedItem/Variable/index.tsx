import { useState, useEffect } from 'react'
import {
  CloseCircleFilled,
  ArrowsAltOutlined,
  ShrinkOutlined,
} from '@ant-design/icons'
import { Space, Tag, Form, Input } from 'antd'
import { TProduct, TProductVariation } from '@/types/wcRestApi'
import { getProductImageSrc, getProductTypeLabel } from '@/utils'
import { addedProductsAtom, FSMetaAtom } from '../../atoms'
import { useSetAtom, useAtomValue } from 'jotai'
import { useMany } from '@/hooks'
import Variation from './Variation'

const Variable: React.FC<{
  product: TProduct
  index: number
}> = ({ product, index }) => {
  const [
    isExpended,
    setIsExpended,
  ] = useState(false)
  const setAddedProducts = useSetAtom(addedProductsAtom)
  const FSMeta = useAtomValue(FSMetaAtom)
  const id = product?.id ?? 0
  const matchProduct = FSMeta.find((item) => item.productId === id)
  const name = product?.name ?? '未知商品'
  const type = product?.type ?? ''
  const imageSrc = getProductImageSrc(product)
  const categories = product?.categories ?? []
  const variations = product?.variations ?? []

  const form = Form.useFormInstance()

  const productVariationsResult = useMany({
    resource: `products/${id}/variations`,
    dataProvider: 'wc',
    queryOptions: {
      enabled: variations.length > 0,
    },
  })

  const productVariations: TProductVariation[] =
    productVariationsResult?.data?.data ?? []

  const handleRemoveProduct = () => {
    setAddedProducts((prev) => prev.filter((item) => item?.id !== id))
  }

  useEffect(() => {
    form.setFieldsValue({
      [index]: {
        productId: id,
      },
    })
  }, [id])

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-1 mr-4">
          <div className="mr-4">
            <img className="h-16 w-16 rounded-xl object-cover" src={imageSrc} />
            <p className="m-0 text-xs text-gray-400">
              {getProductTypeLabel(type)}
            </p>
            <p className="m-0 text-xs text-gray-400">ID: #{id}</p>
          </div>
          <div className="flex-1">
            <Space
              size={[
                0,
                8,
              ]}
              wrap
            >
              {categories.map((cat) => (
                <Tag key={cat?.id} color="#2db7f5">
                  {cat?.name}
                </Tag>
              ))}
            </Space>
            <h6 className="text-[1rem] mt-2 mb-0">{name}</h6>
            <div className="flex">
              <span
                className="underline text-blue-500 cursor-pointer mt-2 mb-4"
                onClick={() => setIsExpended(!isExpended)}
              >
                {isExpended ? (
                  <ShrinkOutlined className="mr-1" />
                ) : (
                  <ArrowsAltOutlined className="mr-1" />
                )}

                {isExpended ? '收起' : '展開'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <CloseCircleFilled
            className="text-red-500 text-2xl cursor-pointer"
            onClick={handleRemoveProduct}
          />
        </div>
      </div>
      <Form.Item
        name={[
          index,
          'productId',
        ]}
        initialValue={id}
        hidden
      >
        <Input />
      </Form.Item>

      <div className={`pl-20 pr-8 ${isExpended ? 'block' : 'hidden'}`}>
        {productVariations.map((variation, i) => (
          <Variation
            key={variation?.id}
            variation={variation}
            parentIndex={index}
            index={i}
            matchProduct={matchProduct}
          />
        ))}
      </div>

      <hr className="mb-8" />
    </>
  )
}

export default Variable