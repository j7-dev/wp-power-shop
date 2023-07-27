import { useState } from 'react'
import { useModal } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct, defaultProduct } from '@/types/wcStoreApi'
import SimpleModal from '@/components/SimpleModal'
import VariableModal from '@/components/VariableModal'

type TCartModalProps = {
  product: TProduct
  FSMeta: TFSMeta | undefined
}

const useCartModal = () => {
  const [
    productFSMeta,
    setProductFSMeta,
  ] = useState<TCartModalProps | undefined>(undefined)
  const utils = useModal({
    className: 'lg:w-1/2 max-w-[960px]',
  })
  const {
    modalProps: defaultModalProps,
    showModal: defaultShowModal,
    setIsModalOpen,
  } = utils
  const showFSModal = (props: TCartModalProps) => () => {
    defaultShowModal()
    setProductFSMeta(props)
  }
  const product = productFSMeta?.product ?? defaultProduct
  const type = product?.type ?? 'simple'
  const FSMeta = productFSMeta?.FSMeta ?? null

  const renderCartModal = () => {
    switch (type) {
      case 'simple':
        return (
          <SimpleModal
            product={product}
            modalProps={defaultModalProps}
            setIsModalOpen={setIsModalOpen}
            FSMeta={FSMeta}
          />
        )
      case 'variable':
        return (
          <VariableModal
            product={product}
            modalProps={defaultModalProps}
            setIsModalOpen={setIsModalOpen}
            FSMeta={FSMeta}
          />
        )
      default:
        return (
          <SimpleModal
            product={product}
            modalProps={defaultModalProps}
            setIsModalOpen={setIsModalOpen}
            FSMeta={FSMeta}
          />
        )
    }
  }

  return {
    ...utils,
    renderCartModal,
    showFSModal,
  }
}

export default useCartModal
