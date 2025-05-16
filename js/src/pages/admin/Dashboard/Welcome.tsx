import { useMemo } from 'react'
import { useOne } from '@refinedev/core'
import { TUserDetails } from '@/components/user/types'
import {
	getCurrentTimeSegment,
	getGreetings,
} from '@/pages/admin/Dashboard/utils'
import { useEnv } from 'antd-toolkit'

const Welcome = () => {
	const { CURRENT_USER_ID } = useEnv()

	const { data: response, isLoading } = useOne<TUserDetails>({
		resource: 'users',
		id: CURRENT_USER_ID,
	})

	const { display_name = '' } = response?.data || {}
	const { key: segmentKey } = getCurrentTimeSegment()
	const greetings = useMemo(
		() => getGreetings(display_name, segmentKey),
		[display_name, segmentKey],
	)

	if (isLoading) {
		return (
			<div className="self-start pl-2 mb-3 w-[37.5rem] rounded-md h-8 bg-gray-200 animate-pulse"></div>
		)
	}

	return (
		<>
			<div className="self-start pl-2">
				<h2 className="font-bold text-2xl">{greetings}</h2>
			</div>
		</>
	)
}

export default Welcome
