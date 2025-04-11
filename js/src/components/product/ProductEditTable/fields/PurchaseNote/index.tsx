import { Form, Input } from 'antd'

const { Item } = Form
const { TextArea } = Input

export const PurchaseNote = ({ index }: { index: number }) => {
	return (
		<>
			<Item label="購買備註" name={[index, 'purchase_note']}>
				<TextArea className="w-full text-xs" size="small" rows={4} allowClear />
			</Item>
		</>
	)
}
