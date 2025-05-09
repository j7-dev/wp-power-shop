import React from 'react'
import { Other as OtherField } from '@/components/product/fields'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { Heading, DatePicker } from 'antd-toolkit'
import { TProductType } from 'antd-toolkit/wp'

export const Other = () => {
	const record = useRecord()
	return (
		<>
			<Heading>其他設定</Heading>
			<div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
				<OtherField type={record?.type as TProductType} />
			</div>

			<Heading>發佈時間</Heading>
			<div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
				<DatePicker
					formItemProps={{
						name: ['date_created'],
						label: '發佈時間',
						className: 'mb-0',
						tooltip: '你可以透過控制發布時間，搭配短代碼，控制課程的排列順序',
					}}
				/>
			</div>
		</>
	)
}
