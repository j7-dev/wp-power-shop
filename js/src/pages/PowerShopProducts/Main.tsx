/* eslint-disable @typescript-eslint/no-empty-function */
import { FC } from 'react'
import { kebab } from '@/utils'
import { Empty } from 'antd'
import Cart from '@/pages/PowerShopProducts/Cart'
import { TAjaxProduct } from '@/types'

const Main: FC<{
  products: TAjaxProduct[]
}> = ({ products }) => {
  if (products.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
  }

  return (
    <div className={`${kebab}-products`}>
      <Cart />
    </div>
  )
}

export default Main
