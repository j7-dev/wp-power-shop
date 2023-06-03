import { Form, InputNumber, Tooltip } from 'antd'
import { TProductVariation, TSimpleAttribute } from '@/types'
import defaultImage from '@/assets/images/defaultImage.jpg'

const Variation: React.FC<{
  variation: TProductVariation
}> = ({ variation }) => {
  const id = variation?.id ?? 0
  const attributes = (variation?.attributes ?? []) as TSimpleAttribute[]
  const name = attributes.map((item) => (
    <span key={item?.id} className="mr-2 font-medium">
      <Tooltip title={item?.name}>{item?.option}</Tooltip>
    </span>
  ))

  const imageSrc = variation?.image?.src ?? defaultImage
  const salesPrice = variation?.sale_price ?? '0'
  const regularPrice = variation?.regular_price ?? '0'

  return (
    <>
      <div className="flex justify-between mt-8">
        <div className="flex flex-1 mr-4">
          <div className="mr-4">
            <img className="h-16 w-16 rounded-xl object-cover" src={imageSrc} />
          </div>
          <div className="flex-1">
            {name}
            <div className="flex">
              <Form.Item
                name={[
                  id,
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
                  id,
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
