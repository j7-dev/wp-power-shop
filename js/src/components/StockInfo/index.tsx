import { FC } from 'react'
import { TAjaxProduct, TStockInfo } from '@/types/custom'
import {
	CheckCircleFilled,
	CloseCircleFilled,
	ExclamationCircleFilled,
} from '@ant-design/icons'
import { showStock } from '@/utils'
import { useAtomValue } from 'jotai'
import { cartDataAtom } from '@/pages/PowerShopProducts/atom'

const defaultStock: TStockInfo = {
	manageStock: false,
	stockQuantity: null,
	stockStatus: 'instock',
}

const SoldOut: FC = () => (
	<>
		<CloseCircleFilled className="mr-2 text-red-500" />
		此商品已售完
	</>
)
const InStock: FC<{ qty?: number; text?: string; qtyInCart?: number }> = ({
	qty,
	text = '此商品還有庫存',
	qtyInCart,
}) => {
	return (
		<>
			<CheckCircleFilled className="mr-2 text-green-500" />
			{text}
			{qty !== undefined ? ` ${qty} 件` : ''}
			<InCart qty={qtyInCart} />
		</>
	)
}
const Onbackorder: FC<{ qtyInCart?: number }> = ({ qtyInCart }) => (
	<>
		<ExclamationCircleFilled className="mr-2 text-orange-500" />
		此商品為延期交貨商品
		<InCart qty={qtyInCart} />
	</>
)

const InCart: FC<{ qty?: number; text?: string }> = ({
	qty,
	text = '，已加入購物車',
}) => {
	if (!qty) return <></>
	return (
		<>
			{text}
			{qty !== undefined ? ` ${qty} 件` : ''}
		</>
	)
}

const index: FC<{
	product: TAjaxProduct
	selectedVariationId: number | null
}> = ({ product, selectedVariationId }) => {
	const cartData = useAtomValue(cartDataAtom)

	if (!showStock) return <></>

	const cartItems = cartData?.items ?? []
	const qtyInCart =
		cartItems.find((item) => item.id === product?.id)?.quantity ?? 0

	const stockText = getStockText(product, selectedVariationId, qtyInCart)

	return <p className="m-0 text-gray-500 text-xs">{stockText}</p>
}

function getStockText(
	product: TAjaxProduct,
	selectedVariationId: number | null,
	qtyInCart: number,
) {
	let stock = defaultStock
	if (!selectedVariationId) {
		stock = product?.stock ?? defaultStock
	} else {
		const variation = product?.variations?.find(
			(v) => v.variation_id === selectedVariationId,
		)
		stock = variation?.stock ?? defaultStock
	}

	const { manageStock, stockQuantity, stockStatus } = stock

	switch (stockStatus) {
		case 'instock':
			if (!manageStock) return <InStock qtyInCart={qtyInCart} />
			if (manageStock && !!stockQuantity) {
				if (stockQuantity <= 10)
					return (
						<InStock
							qty={stockQuantity}
							text="此商品只剩最後"
							qtyInCart={qtyInCart}
						/>
					)
				return (
					<InStock
						qty={stockQuantity}
						text="此商品剩餘"
						qtyInCart={qtyInCart}
					/>
				)
			}
			return <SoldOut />

		case 'outofstock':
			return <SoldOut />
		case 'onbackorder':
			return <Onbackorder qtyInCart={qtyInCart} />
		default:
			return <InStock qtyInCart={qtyInCart} />
	}
}

export default index
