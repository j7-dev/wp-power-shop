import { Form, Select } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { PRODUCT_STATUS } from 'antd-toolkit/wp'

const { Item } = Form

export const Status = ({ id, size }: { id?: string; size?: SizeType }) => {
	return (
		<>
			<Item name={id ? [id, 'status'] : ['status']} label="發佈狀態">
				<Select
					size={size}
					className="w-full"
					options={PRODUCT_STATUS}
					allowClear
				/>
			</Item>
			<Item
				name={id ? [id, 'catalog_visibility'] : ['catalog_visibility']}
				label="可見度"
			>
				<Select
					size={size}
					className="w-full"
					options={[
						{ label: '隱藏', value: 'hidden' },
						{ label: '出現在商店與搜尋結果', value: 'visible' },
						{ label: '只出現在搜尋結果', value: 'search' },
						{ label: '只出現在商店', value: 'catalog' },
					]}
					allowClear
				/>
			</Item>
		</>
	)
}
