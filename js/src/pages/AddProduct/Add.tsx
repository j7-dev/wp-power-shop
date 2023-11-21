import { useState } from 'react'
import { Select, Button, Typography } from 'antd'
import { useMany } from '@/hooks'
import { TProduct, TProductCat } from '@/types/wcRestApi'
import { renderHTML, getProductImageSrc } from '@/utils'
import { addedProductsAtom, isChangeAtom } from './atoms'
import { useAtom, useSetAtom } from 'jotai'

const { Paragraph } = Typography

const renderItem = (product: TProduct) => {
  const imageSrc = getProductImageSrc(product)

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start">
        <img className="w-8 h-8 object-cover mt-1 mr-2 rounded-md" src={imageSrc} />
        <Paragraph ellipsis style={{ width: 240 }}>
          {product?.name ?? '未知產品'}
        </Paragraph>
        {/* {renderHTML()} */}
      </div>

      <div>{renderHTML(product?.price_html)}</div>
    </div>
  )
}

const Add = () => {
  const setIsChange = useSetAtom(isChangeAtom)
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
    setSelectedProductId(undefined)
  }

  const productResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      status: 'publish',
      per_page: 100,
      category: selectedCatId,
      orderby: 'title',
      order: 'asc',
    },
    queryOptions: {
      enabled: !!selectedCatId,
    },
  })

  const rawProducts: TProduct[] = productResult?.data?.data ?? []
  const products = rawProducts.filter((product) => product.type === 'simple' || product.type === 'variable')

  const productItems = products.map((product) => {
    const disabled = addedProducts.some((addedProduct) => addedProduct?.id === product.id)
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
    const selectedProduct = products.find((product) => product.id === selectedProductId)
    if (!!selectedProduct) {
      setAddedProducts([
        ...addedProducts,
        selectedProduct,
      ])
      setIsChange(true)
    }
  }

  const btnDisabled = !selectedProductId || addedProducts.some((addedProduct) => addedProduct?.id === selectedProductId)

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
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          options={productCatItems}
          onChange={handleChangeProductCat}
        />
        <Select
          loading={productResult.isLoading && !!selectedCatId}
          disabled={!selectedCatId || productResult.isLoading}
          className="w-full md:mr-4 mb-2 md:mb-0"
          allowClear
          size="large"
          showSearch
          value={selectedProductId}
          placeholder="選擇產品"
          optionFilterProp="children"
          options={productItems}
          optionLabelProp="label"
          onChange={handleChangeProduct}
          filterOption={(input, option) => {
            const id = option?.value ?? 0
            const theProduct = products.find((product) => product.id === id)

            return (theProduct?.name ?? '').toLowerCase().includes(input.toLowerCase())
          }}
        />
        <Button disabled={btnDisabled} size="large" type="primary" className="mx-0" onClick={handleAddProduct}>
          新增
        </Button>
      </div>
    </div>
  )
}

export default Add
