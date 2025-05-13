import React from 'react'
import { Analytics as AnalyticsPage } from '@/pages/admin/Analytics'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'

export const Analytics = () => {
	const record = useRecord()
	if (!record) return null
	return (
		<div className="py-8">
			<AnalyticsPage
				context="detail"
				initialQuery={{ product_includes: [record.id] }}
			/>
		</div>
	)
}
