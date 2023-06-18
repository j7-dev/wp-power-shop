import { useState } from 'react'
import { useModal, useOne } from '@/hooks'
import { Modal, ModalProps, Col, Row, Button } from 'antd'
import { renderHTML } from '@/utils'
import { TFSMeta, defaultFSMeta } from '@/types'
import { TProduct, defaultProduct } from '@/types/wcStoreApi'
import InputNumber from '@/components/InputNumber'
import Gallery from '@/components/Gallery'
import Price from '@/components/Price'
import ProductVariationsSelect from '@/components/ProductVariationsSelect'
import { useAtomValue } from 'jotai'
import { selectedVariationIdAtom } from '../Item/Variable/atoms'

type TCartModalProps = {
  product: TProduct
  FSMeta: TFSMeta | undefined
}

const useCartModal = () => {
  const [
    productFSMeta,
    setProductFSMeta,
  ] = useState<TCartModalProps | undefined>(undefined)
  const utils = useModal()
  const { modalProps: defaultModalProps, showModal: defaultShowModal } = utils
  const showFSModal = (props: TCartModalProps) => () => {
    defaultShowModal()
    setProductFSMeta(props)
  }
  const product = productFSMeta?.product ?? defaultProduct
  const type = product?.type ?? 'simple'
  const FSMeta = productFSMeta?.FSMeta ?? null
  console.log('🚀 ~ file: useCartModal.tsx:33 ~ useCartModal ~ FSMeta:', FSMeta)

  const selectedVariationId = useAtomValue(selectedVariationIdAtom)

  const variationProductsResult = useOne({
    resource: `products/${selectedVariationId}`,
    dataProvider: 'wc-store',
    queryOptions: {
      enabled: !!selectedVariationId,
    },
  })

  const variationProduct = variationProductsResult?.data?.data ?? []

  const renderSimpleModal = () => {
    const modalProps: ModalProps = {
      centered: true,
      ...defaultModalProps,
      footer: null,
    }

    const id = product?.id ?? 0

    const name = product?.name ?? '未知商品'
    const description = !!selectedVariationId
      ? renderHTML(variationProduct?.description ?? '')
      : renderHTML(product?.description ?? '')
    const images = product?.images ?? []
    const selectedImageId = !!selectedVariationId
      ? variationProduct?.images?.[0]?.id
      : null

    //FIXME 錯的，應該要拿後台的價格

    const price_html = renderHTML(product?.price_html ?? '')

    const price = !!FSMeta ? (
      <Price
        salePrice={FSMeta?.salesPrice}
        regularPrice={FSMeta?.regularPrice}
      />
    ) : (
      price_html
    )

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
            {/* <ProductVariationsSelect product={product} /> */}

            <p className="mb-0 mt-4">數量</p>
            <InputNumber />
            <Button className="w-full mt-4" type="primary">
              加入購物車
            </Button>
          </Col>
        </Row>
      </Modal>
    )
  }

  const renderVariableModal = () => {
    const modalProps: ModalProps = {
      centered: true,
      ...defaultModalProps,
      footer: null,
    }

    const matchVariation = !!FSMeta
      ? (FSMeta?.variations ?? []).find(
          (v) => v.variationId === selectedVariationId,
        )
      : null

    console.log(
      '🚀 ~ file: useCartModal.tsx:33 ~ useCartModal ~ matchVariation:',
      matchVariation,
    )

    const name = product?.name ?? '未知商品'
    const description = !!selectedVariationId
      ? renderHTML(variationProduct?.description ?? '')
      : renderHTML(product?.description ?? '')
    const images = product?.images ?? []
    const selectedImageId = !!selectedVariationId
      ? variationProduct?.images?.[0]?.id
      : null

    //FIXME 錯的，應該要拿後台的價格

    const price_html = renderHTML(product?.price_html ?? '')
    const price = !!matchVariation ? (
      <Price
        salePrice={matchVariation?.salesPrice}
        regularPrice={matchVariation?.regularPrice}
      />
    ) : (
      price_html
    )

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
            <InputNumber />
            <Button className="w-full mt-4" type="primary">
              加入購物車
            </Button>
          </Col>
        </Row>
      </Modal>
    )
  }

  const renderCartModal = () => {
    switch (type) {
      case 'simple':
        return renderSimpleModal()
      case 'variable':
        return renderVariableModal()
      default:
        return renderSimpleModal()
    }
  }

  return {
    ...utils,
    renderCartModal,
    showFSModal,
  }
}

export default useCartModal
