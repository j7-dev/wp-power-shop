import { FC } from 'react'
import { Countdown } from 'antd-utility'

const ShopComing: FC<{ startTime: number }> = ({ startTime }) => {
  return <Countdown date={startTime} title={<p className="text-2xl">商店即將開幕!</p>} className="text-center my-20" />
}

export default ShopComing
