import { Form, Input, Space } from 'antd'
import { TOrderInfo } from '@/pages/admin/Orders/List/types'
import { INFO_LABEL_MAPPER } from '@/utils'
import AddressInput from './AddressInput'
import { useCountries } from 'antd-toolkit/wp'

const { Item } = Form

/**
 * Shipping, Billing 資料欄位
 * ENHANCE 手機加上國碼
 * @param param0
 * @returns
 */
export const InfoTable = ({
	type = 'billing',
	isEditing = false,
	first_name = '',
	last_name = '',
	email = '',
	phone = '',
	company = '',
	state = '',
	postcode = '',
	city = '',
	address_1 = '',
	address_2 = '',
	country = '',
}: {
	type: 'billing' | 'shipping'
	isEditing: boolean
} & TOrderInfo) => {
	const COUNTRIES = useCountries()
	return (
		<table className="table table-vertical table-sm text-xs [&_th]:!w-20 [&_td]:break-all">
			<tbody>
				<tr>
					<th>姓名</th>
					<td className="gap-x-1">
						{!isEditing && `${last_name}${first_name}`}
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
						{isEditing && (
							<Item name={[type, 'phone']} noStyle hidden={!isEditing}>
								<Input size="small" className="text-right text-xs" />
							</Item>
						)}
					</td>
				</tr>
				<tr>
					<th>地址</th>
					<td className="flex flex-col items-end gap-1 text-xs">
						{!isEditing &&
							`${COUNTRIES?.[country] || ''} ${postcode}${state}${city}${address_1}${address_2}`}
						{isEditing &&
							[
								'country',
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
										{
											INFO_LABEL_MAPPER?.[
												field as keyof typeof INFO_LABEL_MAPPER
											]
										}
									</div>
									<AddressInput
										isEditing={isEditing}
										type={type}
										field={field}
									/>
								</Space.Compact>
							))}
					</td>
				</tr>
				{'billing' === type && (
					<tr>
						<th>Email</th>
						<td>
							{!isEditing && email}
							{isEditing && (
								<Item name={[type, 'email']} noStyle hidden={!isEditing}>
									<Input size="small" className="text-right text-xs" />
								</Item>
							)}
						</td>
					</tr>
				)}

				{'billing' === type && (
					<tr>
						<th>公司</th>
						<td>
							{!isEditing && company}
							{isEditing && (
								<Item name={[type, 'company']} noStyle hidden={!isEditing}>
									<Input size="small" className="text-right text-xs" />
								</Item>
							)}
						</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}
