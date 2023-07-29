import { FC } from 'react'
import Countdown from '@/components/Countdown'

const ShopComing: FC<{ startTime: number }> = ({ startTime }) => {
  return <Countdown toTime={startTime} title="商店即將開幕!" />
}

export default ShopComing
