import { Heading } from 'antd-toolkit'

import { InfoTable } from '@/components/order'
import { useIsEditing, useRecord } from '@/pages/admin/Users/Edit/hooks'

const AutoFill = () => {
	const isEditing = useIsEditing()
	const record = useRecord()
	const { billing, shipping } = record

	return (
		<div className="grid grid-cols-1 gap-y-8">
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
