import { Size, Stock as StockField, Sku } from '@/components/product/fields'
import { Heading } from 'antd-toolkit'

export const Stock = () => {
	return (
		<>
			<Heading>貨號</Heading>
			<div className="grid grid-cols-3 gap-x-12">
				<Sku />
			</div>

			<Heading>庫存管理</Heading>
			<div className="grid grid-cols-3 gap-x-12">
				<StockField />
			</div>

			<Heading>運送方式</Heading>
			<div className="grid grid-cols-3 gap-x-12">
				<Size />
			</div>
		</>
	)
}
