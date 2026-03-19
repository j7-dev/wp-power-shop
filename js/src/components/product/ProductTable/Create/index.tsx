import { PlusOutlined } from '@ant-design/icons'
import { useCreate } from '@refinedev/core'
import { Button } from 'antd'

const index = ({ className }: { className?: string }) => {
	const { mutate, isLoading } = useCreate({
		resource: 'products',
		invalidates: ['list'],
	})

	const handleCreate = () => {
		mutate({
			values: {
				name: '新商品',
				status: 'draft',
			},
		})
	}
	return (
		<Button
			loading={isLoading}
			type="primary"
			icon={<PlusOutlined />}
			onClick={handleCreate}
			className={className}
		>
			新增商品
		</Button>
	)
}

export default index
