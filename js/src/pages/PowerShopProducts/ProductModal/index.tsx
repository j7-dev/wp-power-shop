import { FC } from 'react'
import { TProduct } from '@/types/wcStoreApi'
import { Modal, Col, Row } from 'antd'
import Gallery from '@/components/Gallery'
import PlusMinusInput from '@/components/PlusMinusInput'
import AddToCartButton from '@/components/AddToCartButton'
import ToggleContent from '@/components/ToggleContent'
import ProductVariationsSelect from '@/components/ProductVariationsSelect'
import useProductModalProps from './useProductModalProps'

const ProductModal: FC<{ product: TProduct }> = ({ product }) => {
  const productId = product?.id ?? 0
  const {
    modalProps,
    images,
    name,
    price,
    description,
    plusMinusInputProps,
    qty,
    selectedAttributes,
    selectedVariationId,
  } = useProductModalProps(product)

  return (
    <Modal {...modalProps}>
      <Row gutter={24} className="max-h-[75vh] overflow-y-auto">
        <Col span={24} lg={{ span: 10 }} className="mb-4">
          <Gallery images={images} />
        </Col>
        <Col span={24} lg={{ span: 14 }}>
          <div className="flex flex-col relative h-full">
            <div>
              <div className="text-xl mb-4">{name}</div>
              {/* <div
						className="pl-2 mb-2 ml-1"
						style={{ borderLeft: '4px solid #999' }}
					>
						<p className="mb-0 text-sm">全店，海外 $ 5,500 免運費</p>
						<p className="mb-0 text-sm">全店，全館滿 $ 1,200 免運</p>
					</div> */}
              {/* {!!meta?.salesPrice ? (
						<>
							<p className="m-0">
								<del>{regularPrice}</del>
							</p>
							<p className="m-0 text-red-800">{salesPrice}</p>
						</>
					) : (
						<div>{price_html}</div>
					)} */}
              <div>{price}</div>
            </div>
            <div className="my-4 h-[14rem] overflow-y-auto">
              <ToggleContent content={description} />
            </div>

            {product?.type === 'variable' && !!product && (
              <ProductVariationsSelect product={product} />
            )}

            <div className="">
              <p className="mb-0 mt-4">數量</p>
              <PlusMinusInput {...plusMinusInputProps} />
              <AddToCartButton
                productId={productId}
                quantity={qty}
                variation={
                  product?.type === 'variable' ? selectedAttributes : undefined
                }
                variationId={
                  product?.type === 'variable' ? selectedVariationId : undefined
                }
              />
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default ProductModal
