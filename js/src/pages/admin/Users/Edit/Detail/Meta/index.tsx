import { useState, useEffect } from 'react'
import { useIsEditing, useRecord } from '@/pages/admin/Users/Edit/hooks'
import { Form, Input, Alert, Button } from 'antd'

const { Item } = Form
const { TextArea } = Input

const Meta = () => {
	const isContextEditing = useIsEditing()
	const record = useRecord()
	const other_meta_data = record?.other_meta_data || []
	const [isConfirm, setIsConfirm] = useState(false)
	const isEditing = isContextEditing && isConfirm // 要兩層 confirm 才能編輯

	useEffect(() => {
		setIsConfirm(false)
	}, [isContextEditing])

	return (
		<>
			{isContextEditing && (
				<Alert
					className="mb-4"
					message="危險操作"
					description={
						<>
							<p>
								這邊是直接操作 user_meta
								的資料，如果你不明白這個含意，請不要做任何變更
							</p>
							{!isConfirm && (
								<div className="flex justify-start">
									<Button
										size="small"
										type="primary"
										danger
										onClick={() => setIsConfirm(true)}
									>
										我很清楚我在做什麼
									</Button>
								</div>
							)}
						</>
					}
					type="error"
					showIcon
				/>
			)}

			<div className="grid grid-cols-1 gap-8">
				<table className="table table-vertical table-sm text-xs [&_th]:!w-52 [&_td]:break-all [&_th]:break-all">
					<tbody>
						{other_meta_data?.map(
							({ umeta_id, meta_key, meta_value }, index) => (
								<tr key={umeta_id}>
									<th className="text-left">{meta_key}</th>
									<td className="gap-x-1">
										{!isEditing && meta_value}
										{isEditing && (
											<>
												<Item
													name={['other_meta_data', index, 'umeta_id']}
													hidden
												/>
												<Item
													name={['other_meta_data', index, 'meta_key']}
													hidden
												/>
												<Item
													name={['other_meta_data', index, 'meta_value']}
													noStyle
													hidden={!isEditing}
												>
													<TextArea rows={1} className="text-xs" />
													{/* <Input size="small" className="text-right text-xs" /> */}
												</Item>
											</>
										)}
									</td>
								</tr>
							),
						)}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default Meta
