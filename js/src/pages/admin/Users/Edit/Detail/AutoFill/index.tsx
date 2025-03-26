import { Heading } from 'antd-toolkit'
import { useIsEditing, useRecord } from '@/pages/admin/Users/Edit/hooks'
import { InfoTable } from '@/components/order'

const AutoFill = () => {
	const isEditing = useIsEditing()
	const record = useRecord()
	const { billing, shipping } = record

	return (
		<div className="grid grid-cols-2 gap-8">
			<div>
				<Heading className="mb-4" size="sm" hideIcon>
					帳單資訊
				</Heading>
				<InfoTable isEditing={isEditing} type="billing" {...billing} />
			</div>
			<div>
				<Heading className="mb-4" size="sm" hideIcon>
					運送資訊
				</Heading>
				<InfoTable isEditing={isEditing} type="shipping" {...shipping} />
			</div>
		</div>
	)
}

export default AutoFill
