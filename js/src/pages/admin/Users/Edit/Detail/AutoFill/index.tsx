import { Heading } from 'antd-toolkit'
import { InfoTable } from '@/components/user'

const AutoFill = () => {
	return (
		<div className="grid grid-cols-2 gap-8">
			<div>
				<Heading className="mb-4" size="sm" hideIcon>
					帳單資訊
				</Heading>
				<InfoTable type="billing" />
			</div>
			<div>
				<Heading className="mb-4" size="sm" hideIcon>
					運送資訊
				</Heading>
				<InfoTable type="shipping" />
			</div>
		</div>
	)
}

export default AutoFill
