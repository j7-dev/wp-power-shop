import { CloseCircleFilled } from '@ant-design/icons'
import { Space, Tag, Form, InputNumber } from 'antd'
import { TProduct } from '@/types/wcRestApi'
import { getProductImageSrc, getProductTypeLabel } from '@/utils'
import { addedProductsAtom } from '../atoms'
import { useAtom } from 'jotai'
import { toNumber } from 'lodash-es'

const Simple: React.FC<{
  product: TProduct
  index: number
}> = ({ product, index }) => {
  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)
  const id = product?.id ?? 0
  const name = product?.name ?? '未知商品'
  const imageSrc = getProductImageSrc(product)
  const salesPrice = toNumber(product?.sale_price ?? '0')
  const regularPrice = toNumber(product?.regular_price ?? '0')
  const categories = product?.categories ?? []
  const type = product?.type ?? ''

  const handleRemoveProduct = () => {
    setAddedProducts((prev) => prev.filter((item) => item?.id !== id))
  }

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
              <Form.Item
                name={[
                  index,
                  'productId',
                ]}
                hidden
                initialValue={id}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name={[
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

        <div className="flex items-center">
          <CloseCircleFilled
            className="text-red-500 text-2xl cursor-pointer"
            onClick={handleRemoveProduct}
          />
        </div>
      </div>
      <hr className="mb-8" />
    </>
  )
}

export default Simple
