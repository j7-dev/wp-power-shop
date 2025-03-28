import { useIsEditing, useRecord } from '@/pages/admin/Users/Edit/hooks'
import { useOptions } from '@/pages/admin/Users/List/hooks'
import { Form, Input, Space, Select } from 'antd'
import { INFO_LABEL_MAPPER } from '@/utils'

const { Item } = Form
const { TextArea } = Input

const Basic = () => {
	const isEditing = useIsEditing()
	const record = useRecord()
	const { roles: roleOptions } = useOptions()
	const {
		first_name,
		last_name,
		display_name,
		description,
		user_email,
		user_birthday,
		role,
	} = record

	return (
		<div className="grid grid-cols-1 gap-8">
			<table className="table table-vertical table-sm text-xs [&_th]:!w-20 [&_td]:break-all">
				<tbody>
					<tr>
						<th>姓名</th>
						<td className="gap-x-1">
							{!isEditing && `${last_name} ${first_name}`}
							{isEditing &&
								[
									'last_name',
									'first_name',
								].map((field) => (
									<Space.Compact
										key={field}
										block
										className={isEditing ? '' : 'tw-hidden'}
									>
										<div className="text-xs bg-gray-50 border-l border-y border-r-0 border-solid border-gray-300 w-20 rounded-l-[0.25rem] px-2 text-left">
											{
												INFO_LABEL_MAPPER?.[
													field as keyof typeof INFO_LABEL_MAPPER
												]
											}
										</div>
										<Item
											name={[field]}
											noStyle
											label={field}
											hidden={!isEditing}
										>
											<Input
												size="small"
												className="text-right text-xs flex-1"
											/>
										</Item>
									</Space.Compact>
								))}
						</td>
					</tr>
					<tr>
						<th>顯示名稱</th>
						<td>
							{!isEditing && display_name}
							{isEditing && (
								<Item name={['display_name']} noStyle hidden={!isEditing}>
									<Input size="small" className="text-right text-xs" />
								</Item>
							)}
						</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>
							{!isEditing && user_email}
							{isEditing && (
								<Item name={['user_email']} noStyle hidden={!isEditing}>
									<Input size="small" className="text-right text-xs" />
								</Item>
							)}
						</td>
					</tr>
					<tr>
						<th>角色</th>
						<td>
							{!isEditing &&
								(roleOptions?.find(({ value }) => value === role)?.label ||
									role)}
							{isEditing && (
								<Item name={['role']} noStyle hidden={!isEditing}>
									<Select
										size="small"
										className="text-right [&_.ant-select-selection-item]:!text-xs w-full h-[1.125rem]"
										options={roleOptions}
										allowClear
									/>
								</Item>
							)}
						</td>
					</tr>
					<tr>
						<th>生日</th>
						<td>
							{!isEditing && user_birthday}
							{isEditing && (
								<Item name={['user_birthday']} noStyle hidden={!isEditing}>
									<Input size="small" className="text-right text-xs" />
								</Item>
							)}
						</td>
					</tr>
					<tr>
						<th>簡介</th>
						<td>
							{!isEditing && description}
							{isEditing && (
								<Item name={['description']} noStyle hidden={!isEditing}>
									<TextArea rows={6} className="text-xs" />
								</Item>
							)}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default Basic
