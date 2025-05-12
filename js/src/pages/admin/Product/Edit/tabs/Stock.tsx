import { Form, FormProps } from 'antd'
import { Size, Stock as StockField, Sku } from '@/components/product/fields'
import { Heading } from 'antd-toolkit'
import { TProductType } from 'antd-toolkit/wp'

export const Stock = ({ formProps }: { formProps: FormProps }) => {
	const type = Form.useWatch(['type'], formProps.form)

	return (
		<Form {...formProps}>
			<Heading>貨號</Heading>
			<div className="grid grid-cols-3 gap-x-12">
				<Sku />
			</div>

			{/* 組合商品 & 外部/加盟商品部顯示庫存 */}
			{['grouped', 'external'].includes(type) ? null : (
				<>
					<Heading>庫存管理</Heading>
					<div className="grid grid-cols-3 gap-x-12">
						<StockField />
					</div>
				</>
			)}

			<Heading>運送方式</Heading>
			<div className="grid grid-cols-3 gap-x-12">
				<Size />
			</div>
		</Form>
	)
}
