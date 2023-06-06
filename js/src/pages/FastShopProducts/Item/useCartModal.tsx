import { useModal } from '@/hooks'
import { Modal, ModalProps, Col, Row, Button } from 'antd'
import { getCurrencyString, getProductImageSrc, renderHTML } from '@/utils'
import { TProduct, TFastShopMeta } from '@/types'
import InputNumber from '@/components/InputNumber'
import Gallery from '@/components/Gallery'

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
    console.log(
      '🚀 ~ file: useCartModal.tsx:17 ~ useCartModal ~ product:',
      product,
    )
    const modalProps: ModalProps = {
      centered: true,
      ...defaultModalProps,
      open: true,
      footer: null,
    }

    const name = product?.name ?? '未知商品'
    const description = renderHTML(product?.description ?? '')
    const images = product?.images ?? []

    const regularPrice = getCurrencyString({
      price: meta?.regularPrice ?? 0,
    })
    const salesPrice = getCurrencyString({
      price: meta?.salesPrice ?? 0,
    })

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
            {!!meta?.salesPrice ? (
              <>
                <p className="m-0">
                  <del>{regularPrice}</del>
                </p>
                <p className="m-0 text-red-800">{salesPrice}</p>
              </>
            ) : (
              <p className="m-0">{regularPrice}</p>
            )}

            <p className="my-4">{description}</p>
            {/* <p className="fs-variation">5片 $539 ( $108/片)</p>
            <p className="fs-variation">10片 $1050 ( $105/片)</p>
            <p className="fs-variation">20片 $1999 ($100/片)</p>
            <p className="fs-variation">
              水潤面膜*1+光透面膜*1+緊緻面膜*1+噴霧30mL*1 $699
            </p> */}

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
