import { FC, useState } from 'react'
import { Timeline, Tooltip, Input, Form, Switch, Button } from 'antd'
import { cn, renderHTML } from 'antd-toolkit'
import { TOrderRecord } from '@/pages/admin/Orders/List/types'
import dayjs from 'dayjs'
const { TextArea } = Input
const { Item } = Form

export const OrderNotes: FC<{
	record: TOrderRecord
	canDelete?: boolean
	canCreate?: boolean
}> = ({ record, canDelete = true, canCreate = true }) => {
	const [isCustomerNote, setIsCustomerNote] = useState(false)
	const groupedItems = groupItemsByDate(record?.order_notes)
	console.log('⭐ Object.keys(groupedItems):', Object.keys(groupedItems || {}))
	const items = Object.keys(groupedItems || {})?.map((date) => {
		const items = groupedItems[date]

		return {
			children: items.map(
				({ content, date_created, customer_note, added_by }) => (
					<div
						className={cn(
							'p-4 relative mb-4',
							customer_note ? 'bg-yellow-50' : 'bg-blue-50',
						)}
					>
						{renderHTML(content)}
						<p className="text-xs text-gray-400 mb-0">
							{date_created} 刪除備註
						</p>
						<Tooltip
							title={`由 ${added_by === 'system' ? '系統' : added_by} 添加`}
						>
							<div
								className={cn(
									'absolute -top-2 -right-2 text-white px-2 py-1 text-xs',
									customer_note ? 'bg-yellow-500' : 'bg-blue-500',
								)}
							>
								{customer_note ? '客戶備註' : '內部備註'}
							</div>
						</Tooltip>
					</div>
				),
			),
			dot: (
				<p className="text-xs text-right mb-0 relative right-[1rem] text-gray-400">
					{date}
				</p>
			),
		}
	})
	return (
		<>
			<div className="pl-10">
				<Timeline
					items={[
						{
							children: (
								<div className="mb-8">
									<Item className="mb-2" label="">
										<TextArea rows={4} />
									</Item>
									<div className="flex justify-between items-center">
										<div className="flex items-center">
											<Switch
												value={isCustomerNote}
												onChange={() => setIsCustomerNote(!isCustomerNote)}
												size="small"
											/>
											<span className="ml-2 text-sm text-gray-400">
												{isCustomerNote
													? '客戶備註，客戶將會看到此備註'
													: '內部備註'}
											</span>
										</div>
										<Button type="primary">新增</Button>
									</div>
								</div>
							),
							dot: (
								<p className="text-xs text-right mb-0 relative right-[1rem] text-gray-400">
									{dayjs().format('YYYY-MM-DD')}
								</p>
							),
						},
						...items,
						{
							children: '',
							dot: <></>,
						},
					]}
				/>
			</div>
		</>
	)
}

/**
 * 按日期分組項目
 * @param {Array} items - 包含日期的項目陣列
 * @param {string} dateField - 日期欄位的名稱，例如 'date_created'
 * @param {string} dateFormat - 日期格式，預設為 'YYYY-MM-DD'
 * @returns {Object} - 以日期為鍵的分組物件
 */
function groupItemsByDate(
	items: TOrderRecord['order_notes'],
	dateField = 'date_created',
	dateFormat = 'YYYY-MM-DD',
) {
	// 使用 reduce 方法進行分組
	const groupedItems = items?.reduce((groups, item) => {
		// 使用 dayjs 將日期格式化為相同的格式，只保留日期部分
		const dateKey = dayjs(item?.[dateField])?.format(dateFormat)

		// 如果這個日期鍵還不存在，創建一個新陣列
		if (!groups?.[dateKey]) {
			groups[dateKey] = []
		}

		// 將項目添加到對應日期的陣列中
		groups?.[dateKey]?.push(item)

		return groups
	}, {})

	return groupedItems
}
