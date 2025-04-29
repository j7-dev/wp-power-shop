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
			<Item label={label} name={id ? [id, name] : [name]}>
				<TextArea className="w-full text-xs" size={size} rows={4} allowClear />
			</Item>
		</>
	)
}
