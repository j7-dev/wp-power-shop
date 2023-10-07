import { FC } from 'react'
import { MdRemoveShoppingCart } from 'react-icons/md'
import dayjs from 'dayjs'

const ShopClosed: FC<{ endTime: number }> = ({ endTime }) => {
  return (
    <div className="text-center my-20">
      <p className="text-2xl">OOPS! 你來晚了!</p>
      <p className="text-2xl">商店已於 {dayjs(endTime).format('YYYY/MM/DD  HH:mm:ss')} 關閉!</p>
      <MdRemoveShoppingCart className="text-[10rem]" />
    </div>
  )
}

export default ShopClosed
