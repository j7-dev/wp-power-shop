import { useState } from 'react'
import { Select, Button } from 'antd'
import { useMany } from '@/hooks'
import { TProduct, TProductCat } from '@/types'
import { renderHTML, getProductImageSrc } from '@/utils'
import { addedProductsAtom } from './atoms'
import { useAtom } from 'jotai'

const renderItem = (product: TProduct) => {
  const imageSrc = getProductImageSrc(product)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img className="w-8 h-8 object-cover mr-4 rounded-md" src={imageSrc} />
        {product?.name ?? '未知產品'}
      </div>

      <div>{renderHTML(product?.price_html)}</div>
    </div>
  )
}

const Add = () => {
  const [
    addedProducts,
    setAddedProducts,
  ] = useAtom(addedProductsAtom)
  const [
    selectedCatId,
    setSelectedCatId,
  ] = useState<number | undefined>(undefined)
  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState<number | undefined>(undefined)
  const productCatsResult = useMany({
    resource: 'products/categories',
    dataProvider: 'wc',
    args: {
      per_page: 100,
    },
  })

  const productCats: TProductCat[] = productCatsResult?.data?.data ?? []

  const productCatItems = productCats.map((cat) => ({
    value: cat.id,
    label: cat?.name ?? '未知分類',
  }))

  const handleChangeProductCat = (value: number) => {
    setSelectedCatId(value)
  }

  const productResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      per_page: 100,
      category: selectedCatId,
      orderby: 'title',
      order: 'asc',
    },
    queryOptions: {
      enabled: !!selectedCatId,
    },
  })

  const products: TProduct[] = productResult?.data?.data ?? []

  const productItems = products.map((product) => {
    const disabled = addedProducts.some(
      (addedProduct) => addedProduct?.id === product.id,
    )
    return {
      value: product.id,
      label: renderItem(product),
      disabled,
    }
  })

  const handleChangeProduct = (value: number) => {
    setSelectedProductId(value)
  }

  const handleAddProduct = () => {
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId,
    )
    if (!!selectedProduct) {
      setAddedProducts((prev) => {
        const newAddedProducts = [
          ...prev,
          selectedProduct,
        ]
        console.log(
          '🚀 ~ file: Add.tsx:97 ~ setAddedProducts ~ newAddedProducts:',
          newAddedProducts,
        )
        return newAddedProducts
      })
    }
  }

  const btnDisabled =
    !selectedProductId ||
    addedProducts.some((addedProduct) => addedProduct?.id === selectedProductId)

  return (
    <div className="mb-8">
      <p className="mb-2 text-[1rem] font-semibold">選擇要加入的商品</p>

      <div className="flex md:flex-row flex-col">
        <Select
          loading={productCatsResult.isLoading}
          disabled={productCatsResult.isLoading}
          className="w-full md:mr-4 mb-2 md:mb-0"
          allowClear
          size="large"
          showSearch
          placeholder="選擇商品分類"
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={productCatItems}
          onChange={handleChangeProductCat}
        />
        <Select
          loading={productResult.isLoading && !!selectedCatId}
          disabled={!selectedCatId}
          className="w-full md:mr-4 mb-2 md:mb-0"
          allowClear
          size="large"
          showSearch
          placeholder="選擇產品"
          optionFilterProp="children"
          options={productItems}
          optionLabelProp="label"
          onChange={handleChangeProduct}
        />
        <Button
          disabled={btnDisabled}
          size="large"
          type="primary"
          className="mx-0"
          onClick={handleAddProduct}
        >
          新增
        </Button>
      </div>
    </div>
  )
}

export default Add
