import { useModal } from '@/hooks'
import { Modal, ModalProps, Col, Row, Button } from 'antd'
import { renderHTML } from '@/utils'
import { TFastShopMeta } from '@/types'
import { TProduct } from '@/types/wcStoreApi'
import InputNumber from '@/components/InputNumber'
import Gallery from '@/components/Gallery'
import ProductVariationsSelect from '@/components/ProductVariationsSelect'

const useCartModal = () => {
  const utils = useModal()
  const { modalProps: defaultModalProps } = utils

  const renderCartModal = ({
    product,
    meta,
  }: {
    product: TProduct
    meta: TFastShopMeta | undefined
  }) => {
    const modalProps: ModalProps = {
      centered: true,
      ...defaultModalProps,
      footer: null,
    }

    const id = product?.id ?? 0
    console.log(
      '🚀 ~ file: useCartModal.tsx:28 ~ useCartModal ~ product:',
      product,
    )
    const name = product?.name ?? '未知商品'
    const description = renderHTML(product?.description ?? '')
    const images = product?.images ?? []
    const price_html = renderHTML(product?.price_html ?? '')

    return (
      <Modal {...modalProps}>
        <Row gutter={24}>
          <Col span={10}>
            <Gallery images={images} />
          </Col>
          <Col span={14}>
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
            <div>{price_html}</div>

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

  return {
    ...utils,
    renderCartModal,
  }
}

export default useCartModal
