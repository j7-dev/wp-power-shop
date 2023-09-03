import { useEffect } from 'react'
import { isProductModalOpenAtom, selectedVariationIdAtom } from '@/pages/PowerShopProducts/atom'
import { useAtomValue, useAtom, useSetAtom } from 'jotai'
import { TAjaxProduct } from '@/types/custom'
import Price from '@/components/Price'
import { renderHTML, formatYoutubeLinkToIframe } from '@/utils'
import { usePlusMinusInput } from '@/hooks'
import { ModalProps } from 'antd'
import { isExpandAtom } from '@/pages/PowerShopProducts/ProductModal/atom'

const useProductModalProps = (product: TAjaxProduct) => {
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
  console.log('⭐  useProductModalProps  selectedVariationId', selectedVariationId)

  const productType = product?.type ?? 'simple'

  const getPrice = () => {
    switch (productType) {
      case 'simple':
        return <Price salePrice={product?.salesPrice} regularPrice={product?.regularPrice} />
      case 'variable':
        const productVariations = product?.variations ?? []
        const theVariation = productVariations.find((v) => v.variation_id === selectedVariationId)

        return <Price salePrice={theVariation?.salesPrice} regularPrice={theVariation?.regularPrice} />
      default:
        return '找不到價格'
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
    selectedVariationId,
  }
}

export default useProductModalProps
