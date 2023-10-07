/* eslint-disable @typescript-eslint/no-empty-function */
import { FC } from 'react'
import { kebab } from '@/utils'
import { Empty } from 'antd'
import Countdown from '@/components/Countdown'
import { showCartAtom } from '@/pages/PowerShopProducts/atom'
import { useAtomValue } from 'jotai'
import Cart from '@/pages/PowerShopProducts/Cart'
import { TAjaxProduct } from '@/types'

const Main: FC<{
  products: TAjaxProduct[]
  endTime?: number
}> = ({ products, endTime }) => {
  const showCart = useAtomValue(showCartAtom)

  if (products.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
  }

  return (
    <div className={`${kebab}-products`}>
      {!!endTime && <Countdown toTime={endTime} title="把握最後機會🎉優惠即將到期🎉🎉🎉" />}
      <div className={showCart ? 'block' : 'hidden'}>
        <Cart />
      </div>
    </div>
  )
}

export default Main
