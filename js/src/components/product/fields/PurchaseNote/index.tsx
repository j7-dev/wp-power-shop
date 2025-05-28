import { Form, Input } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
const { Item } = Form
const { TextArea } = Input

export const PurchaseNote = ({
	id,
	label = '購買備註',
	name = 'purchase_note',
	size,
}: {
	id?: string
	label?: string
	name?: string
	size?: SizeType
}) => {
	return (
		<>
			<Item
				label={label}
				name={id ? [id, name] : [name]}
				tooltip="購買備註僅會出現在用戶下單後的 Email 內"
			>
				<TextArea
					placeholder="輸入用戶購買產品後的注意事項"
					className="w-full text-xs"
					size={size}
					rows={4}
					allowClear
				/>
			</Item>
		</>
	)
}
