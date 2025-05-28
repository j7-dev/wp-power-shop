import { Form, Input, Select } from 'antd'
import { useCountryOptions } from 'antd-toolkit/wp'

const { Item } = Form

const AddressInput = ({
	type,
	isEditing,
	field,
}: {
	type: 'billing' | 'shipping'
	isEditing: boolean
	field: string
}) => {
	const countryOptions = useCountryOptions()

	if ('country' === field) {
		return (
			<>
				<Item name={[type, field]} noStyle label={field} hidden={!isEditing}>
					<Select
						options={countryOptions}
						size="small"
						className="text-right [&_.ant-select-selection-item]:!text-xs flex-1 h-[1.125rem]"
						allowClear
					/>
				</Item>
			</>
		)
	}

	return (
		<>
			<Item name={[type, field]} noStyle label={field} hidden={!isEditing}>
				<Input size="small" className="text-right text-xs flex-1" />
			</Item>
		</>
	)
}

export default AddressInput
