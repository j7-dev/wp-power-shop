import { FC, useEffect } from 'react'
import { TProduct } from '@/types/wcStoreApi'
import { Modal, ModalProps, Col, Row } from 'antd'
import { TFSMeta } from '@/types'
import { renderHTML } from '@/utils'
import Price from '@/components/Price'
import Gallery from '@/components/Gallery'
import PlusMinusInput from '@/components/PlusMinusInput'
import AddToCartButton from '@/components/AddToCartButton'
import { usePlusMinusInput, useOne } from '@/hooks'
import { useAtomValue } from 'jotai'
import { selectedVariationIdAtom } from '@/pages/FastShopProducts/Item/Variable/atoms'
import ProductVariationsSelect from '@/components/ProductVariationsSelect'

const VariableModal: FC<{
  product: TProduct
  modalProps: ModalProps
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  FSMeta: TFSMeta | null
}> = ({ product, modalProps: defaultModalProps, setIsModalOpen, FSMeta }) => {
  const productId = product?.id ?? 0

  const modalProps: ModalProps = {
    centered: true,
    ...defaultModalProps,
    footer: null,
  }

  const selectedVariationId = useAtomValue(selectedVariationIdAtom)

  const variationProductsResult = useOne({
    resource: `products/${selectedVariationId}`,
    dataProvider: 'wc-store',
    queryOptions: {
      enabled: !!selectedVariationId,
    },
  })

  const variationProduct = variationProductsResult?.data?.data ?? []
  console.log('⭐ ~ product:', product)

  const matchVariation = !!FSMeta
    ? (FSMeta?.variations ?? []).find(
        (v) => v.variationId === selectedVariationId,
      )
    : null

  const name = product?.name ?? '未知商品'
  const description = !!selectedVariationId
    ? renderHTML(variationProduct?.description ?? '')
    : renderHTML(product?.description ?? '')
  const images = product?.images ?? []
  const selectedImageId = !!selectedVariationId
    ? variationProduct?.images?.[0]?.id
    : null

  const price_html = renderHTML(product?.price_html ?? '')
  const price = !!matchVariation ? (
    <Price
      salePrice={matchVariation?.salesPrice}
      regularPrice={matchVariation?.regularPrice}
    />
  ) : (
    price_html
  )

  const plusMinusInputProps = usePlusMinusInput()
  const { value: qty, setValue: setQty } = plusMinusInputProps
  useEffect(() => {
    if (defaultModalProps.open) {
      setQty(1)
    }
  }, [defaultModalProps.open])

  return (
    <Modal {...modalProps}>
      <Row gutter={24} className="max-h-[75vh] overflow-y-auto">
        <Col span={24} lg={{ span: 10 }} className="mb-4">
          <Gallery images={images} selectedImageId={selectedImageId} />
        </Col>
        <Col span={24} lg={{ span: 14 }}>
          <h2 className="text-xl mb-4">{name}</h2>
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

          {/* TODO: 展開註解 */}
          <div className="my-4">{description}</div>
          <ProductVariationsSelect product={product} />

          <p className="mb-0 mt-4">數量</p>
          <PlusMinusInput {...plusMinusInputProps} />
          <AddToCartButton
            productId={productId}
            quantity={qty}
            variation={undefined}
            variationId={selectedVariationId}
            setIsModalOpen={setIsModalOpen}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default VariableModal
