/* eslint-disable @typescript-eslint/no-empty-function */
import { FC } from 'react'
import { kebab } from '@/utils'
import { Empty } from 'antd'
import { Countdown } from 'antd-utility'
import Cart from '@/pages/PowerShopProducts/Cart'
import { TAjaxProduct } from '@/types'

const Main: FC<{
  products: TAjaxProduct[]
  endTime?: number
}> = ({ products, endTime }) => {
  if (products.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
  }

  return (
    <div className={`${kebab}-products`}>
      {!!endTime && <Countdown className="text-center my-20" date={endTime} title={<p className="text-2xl">把握最後機會🎉優惠即將到期🎉🎉🎉</p>} />}
      <Cart />
    </div>
  )
}

export default Main
