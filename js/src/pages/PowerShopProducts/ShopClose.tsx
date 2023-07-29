import { MdRemoveShoppingCart } from 'react-icons/md'

const ShopClose = () => {
  return (
    <div className="text-center my-20">
      <p className="text-2xl">OOPS! 你來晚了! 商店已經關閉!</p>
      <MdRemoveShoppingCart className="text-[10rem]" />
    </div>
  )
}

export default ShopClose
