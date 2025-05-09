import { useState } from 'react'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { SortableList } from '@/components/productAttribute/SortableList'
import { Alert, Tag } from 'antd'
import { EditForm } from '@/components/productAttribute/EditForm'

export const Attributes = () => {
	const record = useRecord()
	const attributes = record?.attributes
	/** 編輯的規格有值時，表示編輯模式，沒有就是新增 */
	const [selectedTermId, setSelectedTermId] = useState<string | null>(null)

	return (
		<>
			<Alert
				className="mb-4"
				message="什麼時候該建立全局商品規格？"
				description={
					<>
						<p className="m-0">
							當你想要在所有商品中使用相同的商品規格時，可以使用全局商品規格。
						</p>
						<p className="m-0">
							例如：你商店的衣服商品都有固定衣服尺寸 (S, M, L, XL) ，可以設定{' '}
							<Tag color="blue">衣服尺寸</Tag>
							為全局商品規格，這樣所有商品都會有衣服尺寸這個商品規格。
						</p>
					</>
				}
				type="info"
				showIcon
				closable
			/>

			<SortableList
				attributes={attributes || []}
				selectedTermId={selectedTermId}
				setSelectedTermId={setSelectedTermId}
				Edit={EditForm}
			/>
		</>
	)
}
