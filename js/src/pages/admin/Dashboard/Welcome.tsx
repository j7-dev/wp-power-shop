import { useOne } from '@refinedev/core'
import { useEnv } from 'antd-toolkit'
import { TUserDetails } from '@/pages/admin/Users/types'
import { getCurrentTimeSegment, getGreetings } from './utils'
const Welcome = () => {
	const { CURRENT_USER_ID } = useEnv()

	const { data: response, isLoading } = useOne<TUserDetails>({
		resource: 'users',
		id: CURRENT_USER_ID,
	})

	if (isLoading) return <div>載入中...</div>

	const { display_name = '' } = response?.data || {}
	const { key: segmentKey } = getCurrentTimeSegment()
	const greetings = getGreetings(display_name, segmentKey)

	return (
		<div className="self-start pl-2">
			<h2 className="font-bold text-2xl">{greetings}</h2>
		</div>
	)
}

export default Welcome
