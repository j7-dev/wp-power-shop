import { FC, useEffect } from 'react'
import { TProduct } from '@/types/wcStoreApi'
import { Modal, ModalProps, Col, Row } from 'antd'
import { renderHTML } from '@/utils'
import Price from '@/components/Price'
import Gallery from '@/components/Gallery'
import PlusMinusInput from '@/components/PlusMinusInput'
import AddToCartButton from '@/components/AddToCartButton'
import ToggleContent from '@/components/ToggleContent'
import { usePlusMinusInput } from '@/hooks'
import {
  shopMetaAtom,
  isProductModalOpenAtom,
} from '@/pages/PowerShopProducts/atom'
import { useAtomValue, useAtom } from 'jotai'

const SimpleModal: FC<{ product: TProduct | undefined }> = ({ product }) => {
  const productId = product?.id ?? 0
  const shop_meta = useAtomValue(shopMetaAtom)
  const FSMeta = shop_meta.find((meta) => meta.productId === productId)
  const [
    isProductModalOpen,
    setIsProductModalOpen,
  ] = useAtom(isProductModalOpenAtom)
  const modalProps: ModalProps = {
    centered: true,
    footer: null,
    className: 'lg:w-1/2 lg:max-w-[960px]',
    open: isProductModalOpen,
    onCancel: () => setIsProductModalOpen(false),
  }
  const name = renderHTML(product?.name ?? '未知商品')
  const description = product?.description ?? ''
  const images = product?.images ?? []
  const price_html = renderHTML(product?.price_html ?? '')

  const plusMinusInputProps = usePlusMinusInput()
  const { value: qty, setValue: setQty } = plusMinusInputProps

  useEffect(() => {
    if (isProductModalOpen) {
      setQty(1)
    }
  }, [isProductModalOpen])

  const price = !!FSMeta ? (
    <Price salePrice={FSMeta?.salesPrice} regularPrice={FSMeta?.regularPrice} />
  ) : (
    price_html
  )

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

            <div className="">
              <p className="mb-0 mt-4">數量</p>
              <PlusMinusInput {...plusMinusInputProps} />
              <AddToCartButton
                productId={productId}
                quantity={qty}
                variation={undefined}
                variationId={undefined}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default SimpleModal
