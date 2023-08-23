import { useEffect } from 'react'
import {
  shopMetaAtom,
  isProductModalOpenAtom,
  selectedVariationIdAtom,
} from '@/pages/PowerShopProducts/atom'
import { useAtomValue, useAtom } from 'jotai'
import { TProduct } from '@/types/wcStoreApi'
import Price from '@/components/Price'
import { renderHTML } from '@/utils'
import { usePlusMinusInput } from '@/hooks'
import { ModalProps } from 'antd'

const useProductModalProps = (product: TProduct) => {
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

  const selectedVariationId = useAtomValue(selectedVariationIdAtom)

  const variations = product?.variations ?? []

  const selectedAttributes =
    variations.find((v) => v.id === selectedVariationId)?.attributes ?? []

  const matchVariationMeta = !!FSMeta
    ? (FSMeta?.variations ?? []).find(
        (v) => v.variationId === selectedVariationId,
      )
    : null

  const productType = product?.type ?? 'simple'

  const getPrice = () => {
    switch (productType) {
      case 'simple':
        return !!FSMeta ? (
          <Price
            salePrice={FSMeta?.salesPrice}
            regularPrice={FSMeta?.regularPrice}
          />
        ) : (
          price_html
        )
      case 'variable':
        return !!matchVariationMeta ? (
          <Price
            salePrice={matchVariationMeta?.salesPrice}
            regularPrice={matchVariationMeta?.regularPrice}
          />
        ) : (
          price_html
        )
      default:
        return price_html
    }
  }

  const price = getPrice()

  return {
    modalProps,
    images,
    name,
    price,
    description,
    plusMinusInputProps,
    qty,
    selectedAttributes,
    selectedVariationId,
  }
}

export default useProductModalProps
