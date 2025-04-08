import { Flex } from 'antd'
import Welcome from './Welcome'
import DashboardCards from './DashboardCards'
import LeaderBoard from './LeaderBoard'
import IntervalChart from './IntervalChart'

export const Summary = () => {
	return (
		<Flex vertical gap="middle" className="w-full" align="center">
			<Welcome />
			<DashboardCards />
			<LeaderBoard />
			<IntervalChart />
		</Flex>
	)
}
