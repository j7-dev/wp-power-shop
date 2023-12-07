import { FC } from 'react'
import { TAjaxProduct } from '@/types/custom'
import { Modal, Col, Row } from 'antd'
import Gallery from '@/components/Gallery'
import PlusMinusInput from '@/components/PlusMinusInput'
import StockInfo from '@/components/StockInfo'
import BuyerCount from '@/components/BuyerCount'
import AddToCartButton from '@/pages/PowerShopProducts/ProductModal/AddToCartButton'
import ToggleContent from '@/pages/PowerShopProducts/ProductModal/ToggleContent'
import ProductVariationsSelect from '@/components/ProductVariationsSelect'
import useProductModalProps from '@/pages/PowerShopProducts/ProductModal/useProductModalProps'
import { ShrinkOutlined, ArrowsAltOutlined } from '@ant-design/icons'
import { useAtom, useAtomValue } from 'jotai'
import { isExpandAtom, showReadMoreAtom } from '@/pages/PowerShopProducts/ProductModal/atom'
import { selectedVariationIdAtom } from '@/pages/PowerShopProducts/atom'

const ProductModal: FC<{ product: TAjaxProduct }> = ({ product }) => {
  const { modalProps, images, name, price, description, plusMinusInputProps, qty } = useProductModalProps(product)
  const selectedVariationId = useAtomValue(selectedVariationIdAtom)

  const [
    isExpand,
    setIsExpand,
  ] = useAtom(isExpandAtom)
  const showReadMore = useAtomValue(showReadMoreAtom)

  const handleExpand = () => {
    setIsExpand(!isExpand)
  }

  return (
    <Modal {...modalProps}>
      <Row gutter={24} className="max-h-[75vh] overflow-y-auto">
        <Col span={24} lg={{ span: 10 }} className="mb-4 relative">
          <div className="sticky top-0">
            <Gallery images={images} />
          </div>
        </Col>
        <Col span={24} lg={{ span: 14 }}>
          <div className="flex flex-col">
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
            </div>
            <div className="my-4">
              <ToggleContent content={description} />
            </div>

            <div>
              {product?.type === 'variable' && !!product && <ProductVariationsSelect product={product} />}
              <StockInfo product={product} selectedVariationId={selectedVariationId} />
              <BuyerCount product={product} selectedVariationId={selectedVariationId} />
            </div>

            <div className="mt-4">{price}</div>

            <div>
              <p className="mb-0 mt-4">數量</p>
              <PlusMinusInput {...plusMinusInputProps} />
              <AddToCartButton product={product} quantity={qty} />
            </div>
          </div>
        </Col>
      </Row>
      {showReadMore && (
        <div
          className="absolute bottom-24 right-0 md:-right-8 bg-white w-8 flex items-center py-3 cursor-pointer shadow md:shadow-none opacity-50 md:opacity-100 rounded-l-lg md:rounded-l-none md:rounded-r-lg"
          style={{
            writingMode: 'vertical-rl',
          }}
          onClick={handleExpand}>
          {isExpand ? (
            <>
              <ShrinkOutlined className="mb-2" />
              收合全部內容
            </>
          ) : (
            <>
              <ArrowsAltOutlined className="mb-2" />
              展開全部內容
            </>
          )}
        </div>
      )}
    </Modal>
  )
}

export default ProductModal
