import { useState } from 'react'

import { Select, Button } from 'antd'
import { useMany } from '@/hooks'
import { TProduct, TProductCat } from '@/types'

function DefaultPage() {
  const [
    selectedCatId,
    setSelectedCatId,
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

  const handleChange = (value: number) => {
    setSelectedCatId(value)
  }

  const productResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      per_page: 100,
      category: selectedCatId,
    },
    queryOptions: {
      enabled: !!selectedCatId,
    },
  })

  const products: TProduct[] = productResult?.data?.data ?? []
  console.log('🚀 ~ file: index.tsx:44 ~ DefaultPage ~ products:', products)

  const productItems = products.map((product) => ({
    value: product.id,
    label: product?.name ?? '未知商品名稱',
  }))

  return (
    <div className="App py-20">
      <div className="flex md:flex-row flex-col">
        <Select
          className="w-full md:mr-4 mb-2 md:mb-0"
          allowClear
          size="large"
          showSearch
          placeholder="選擇商品分類"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={productCatItems}
          onChange={handleChange}
        />
        <Select
          className="w-full md:mr-4 mb-2 md:mb-0"
          allowClear
          size="large"
          showSearch
          placeholder="選擇產品"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={productItems}
        />
        <Button size="large" type="primary" className="mx-0">
          新增
        </Button>
      </div>
    </div>
  )
}

export default DefaultPage
