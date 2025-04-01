import { useState, useEffect } from 'react'
import { useIsEditing, useRecord } from '@/pages/admin/Users/Edit/hooks'
import { useOptions } from '@/pages/admin/Users/List/hooks'
import ResetPassButton from '@/components/user/UserTable/BulkAction/ResetPassButton'
import { Form, Input, Space, Select, Button, DatePicker } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { INFO_LABEL_MAPPER } from '@/utils'
import dayjs, { Dayjs } from 'dayjs'
import { Heading } from 'antd-toolkit'

const { Item } = Form
const { TextArea } = Input

const Basic = () => {
	const isEditing = useIsEditing()
	const [confirmEditingPassword, setConfirmEditingPassword] = useState(false)
	const record = useRecord()
	const { roles: roleOptions } = useOptions()
	const {
		id,
		first_name,
		last_name,
		display_name,
		description,
		user_email,
		user_birthday,
		role,
	} = record

	const canEditPassword = isEditing && confirmEditingPassword

	useEffect(() => {
		setConfirmEditingPassword(false)
	}, [isEditing])

	return (
		<div className="grid grid-cols-1 gap-y-2">
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
								<Item
									name={['user_birthday']}
									noStyle
									hidden={!isEditing}
									getValueProps={(value: string | null | undefined) => {
										// 用 regex 判斷是否為 YYYY-MM-DD
										if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
											return {
												value: undefined,
											}
										}
										return {
											value: dayjs(value, 'YYYY-MM-DD'),
										}
									}}
									normalize={(value: Dayjs) => value.format('YYYY-MM-DD')}
								>
									<DatePicker
										className="w-full"
										placeholder="選擇日期"
										size="small"
										allowClear
									/>
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

			<Heading className="mb-4" size="sm" hideIcon>
				密碼
			</Heading>

			<table className="table table-vertical table-sm text-xs [&_th]:!w-20 [&_td]:break-all">
				<tbody>
					<tr>
						<th>修改密碼</th>
						<td>
							{!canEditPassword && (
								<>
									<ResetPassButton
										user_ids={[id]}
										size="small"
										variant="filled"
										className="w-fit px-4"
									/>
									{isEditing && (
										<Button
											size="small"
											color="primary"
											variant="solid"
											className="w-fit px-4 ml-2"
											onClick={() => setConfirmEditingPassword(true)}
										>
											直接修改密碼
										</Button>
									)}
								</>
							)}
							{canEditPassword && (
								<Item name={['user_pass']} noStyle hidden={!canEditPassword}>
									<Input.Password
										size="small"
										className="text-right text-xs"
										placeholder="請輸入新密碼"
										iconRender={(visible) =>
											visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
										}
									/>
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
