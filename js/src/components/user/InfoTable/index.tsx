import { Form, Input, Space } from 'antd'
import { useIsEditing, useRecord } from '@/pages/admin/Users/Edit/hooks'
import { INFO_LABEL_MAPPER } from '@/utils'

const defaultInfo: any = {
	full_name: '',
	email: '',
	phone: '',
	company: '',
	country: '',
	state: '',
	postcode: '',
	city: '',
	address_1: '',
	address_2: '',
}

const { Item } = Form

export const InfoTable = ({
	type = 'billing',
}: {
	type: 'billing' | 'shipping'
}) => {
	const record = useRecord()
	const {
		first_name,
		last_name,
		email,
		phone,
		company,
		state,
		postcode,
		city,
		address_1,
		address_2,
		country,
	} = record?.[type] || defaultInfo
	const isEditing = useIsEditing()
	return (
		<table className="table table-vertical table-xs text-xs [&_th]:!w-20">
			<tbody>
				<tr>
					<th>姓名</th>
					<td className="gap-x-1">
						{!isEditing && `${first_name} ${last_name}`}
						{[
							'last_name',
							'first_name',
						].map((field) => (
							<Space.Compact
								key={field}
								block
								className={isEditing ? '' : 'tw-hidden'}
							>
								<div className="text-xs bg-gray-50 border-l border-y border-r-0 border-solid border-gray-300 w-20 rounded-l-[0.25rem] px-2 text-left">
									{INFO_LABEL_MAPPER?.[field as keyof typeof INFO_LABEL_MAPPER]}
								</div>
								<Item
									name={[type, field]}
									noStyle
									label={field}
									hidden={!isEditing}
								>
									<Input size="small" className="text-right text-xs flex-1" />
								</Item>
							</Space.Compact>
						))}
					</td>
				</tr>
				<tr>
					<th>電話</th>
					<td>
						{!isEditing && phone}
						<Item name={[type, 'phone']} noStyle hidden={!isEditing}>
							<Input size="small" className="text-right text-xs" />
						</Item>
					</td>
				</tr>
				<tr>
					<th>地址</th>
					<td className="flex flex-col items-end gap-1 text-xs">
						{!isEditing && `${postcode}${state}${city}${address_1}${address_2}`}
						{[
							'postcode',
							'state',
							'city',
							'address_1',
							'address_2',
						].map((field) => (
							<Space.Compact
								key={field}
								block
								className={isEditing ? '' : 'tw-hidden'}
							>
								<div className="text-xs bg-gray-50 border-l border-y border-r-0 border-solid border-gray-300 w-20 rounded-l-[0.25rem] px-2 text-left">
									{INFO_LABEL_MAPPER?.[field as keyof typeof INFO_LABEL_MAPPER]}
								</div>
								<Item
									name={[type, field]}
									noStyle
									label={field}
									hidden={!isEditing}
								>
									<Input size="small" className="text-right text-xs flex-1" />
								</Item>
							</Space.Compact>
						))}
					</td>
				</tr>
				{(email || isEditing) && (
					<tr>
						<th>Email</th>
						<td>
							{!isEditing && email}
							<Item name={[type, 'email']} noStyle hidden={!isEditing}>
								<Input size="small" className="text-right text-xs" />
							</Item>
						</td>
					</tr>
				)}
				{(company || isEditing) && 'billing' === type && (
					<tr>
						<th>公司</th>
						<td>
							{!isEditing && company}
							<Item name={[type, 'company']} noStyle hidden={!isEditing}>
								<Input size="small" className="text-right text-xs" />
							</Item>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}
