import { Form, Input } from 'antd'

const { Item } = Form
const { TextArea } = Input

export const PurchaseNote = ({
	id,
	name = 'purchase_note',
}: {
	id: string
	name: string
}) => {
	return (
		<>
			<Item label="購買備註" name={[id, name]}>
				<TextArea className="w-full text-xs" size="small" rows={4} allowClear />
			</Item>
		</>
	)
}
