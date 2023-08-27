import { useEffect } from 'react'
import {
  shopMetaAtom,
  isProductModalOpenAtom,
  selectedVariationIdAtom,
} from '@/pages/PowerShopProducts/atom'
import { useAtomValue, useAtom, useSetAtom } from 'jotai'
import { TFormattedProduct } from '@/types'
import Price from '@/components/Price'
import { renderHTML, formatYoutubeLinkToIframe } from '@/utils'
import { usePlusMinusInput } from '@/hooks'
import { ModalProps } from 'antd'
import { TSimpleAttribute } from '@/types/wcRestApi'
import { isExpandAtom } from '@/pages/PowerShopProducts/ProductModal/atom'

const useProductModalProps = (product: TFormattedProduct) => {
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
  const description = formatYoutubeLinkToIframe(product?.description ?? '')
  const images = product?.images ?? []
  const price_html = renderHTML(product?.price_html ?? '')

  const plusMinusInputProps = usePlusMinusInput()
  const { value: qty, setValue: setQty } = plusMinusInputProps
  const setIsExpand = useSetAtom(isExpandAtom)

  useEffect(() => {
    // 開關重設數量 & 將內容收闔

    if (isProductModalOpen) {
      setQty(1)
      setIsExpand(false)
    }
  }, [isProductModalOpen])

  const selectedVariationId = useAtomValue(selectedVariationIdAtom)

  const variation_objs = product?.variation_objs ?? []

  const selectedVariationAttributes = (variation_objs.find(
    (v) => v.id === selectedVariationId,
  )?.attributes ?? []) as TSimpleAttribute[]
  const selectedAttributes = selectedVariationAttributes.map((a) => ({
    name: a?.name ?? '',
    value: a?.option ?? '',
  }))

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
