import { useEffect } from 'react'
import { Form, InputNumber, Tooltip, Input } from 'antd'
import { TProductVariation, TSimpleAttribute } from '@/types/wcRestApi'
import { defaultImage } from '@/utils'
import { nanoid } from 'nanoid'
import { TFSMeta } from '@/types'

const Variation: React.FC<{
  variation: TProductVariation
  parentIndex: number
  parentId: number
  index: number
  matchProduct: TFSMeta | undefined
}> = ({ variation, parentIndex, parentId, index, matchProduct }) => {
  const id = variation?.id ?? 0
  const matchVariation = !!matchProduct
    ? (matchProduct?.variations ?? [])?.find((v) => v.variationId === id)
    : null
  const attributes = (variation?.attributes ?? []) as TSimpleAttribute[]
  const name = attributes.map((a) => (
    <span key={nanoid()} className="mr-2 font-medium">
      <Tooltip title={a?.name}>{a?.option}</Tooltip>
    </span>
  ))
  const form = Form.useFormInstance()

  const imageSrc = variation?.image?.src ?? defaultImage
  const salesPrice = !!matchVariation
    ? matchVariation?.salesPrice
    : variation?.sale_price ?? '0'
  const regularPrice = !!matchVariation
    ? matchVariation?.regularPrice
    : variation?.regular_price ?? '0'

  useEffect(() => {
    form.setFieldsValue({
      [parentIndex]: {
        productId: parentId,
        variations: {
          [index]: {
            variationId: id,
            regularPrice,
            salesPrice,
          },
        },
      },
    })
  }, [
    id,
    parentIndex,
    index,
  ])

  return (
    <>
      <div className="flex justify-between mt-8">
        <div className="flex flex-1 mr-4">
          <div className="mr-4">
            <img className="h-16 w-16 rounded-xl object-cover" src={imageSrc} />
            <p className="m-0 text-xs text-gray-400">ID: #{id}</p>
            <p className="m-0 text-xs text-gray-400">
              原價: {variation?.regular_price ?? ''}
            </p>
            <p className="m-0 text-xs text-gray-400">
              特價: {variation?.sale_price ?? ''}
            </p>
          </div>
          <div className="flex-1">
            {name}
            <div className="flex">
              <Form.Item
                name={[
                  parentIndex,
                  'variations',
                  index,
                  'variationId',
                ]}
                initialValue={id}
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={[
                  parentIndex,
                  'variations',
                  index,
                  'regularPrice',
                ]}
                label="原價"
                className="w-full mr-4"
                initialValue={regularPrice}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name={[
                  parentIndex,
                  'variations',
                  index,
                  'salesPrice',
                ]}
                label="特價"
                className="w-full"
                initialValue={salesPrice}
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Variation
