import { SizeType } from 'antd/es/config-provider/SizeContext'
import { Switch } from 'antd-toolkit'

export const Gallery = ({ id, size }: { id?: string; size?: SizeType }) => {
	return (
		<>
			<Switch
				formItemProps={{
					name: id ? [id, 'virtual'] : ['virtual'],
					label: '虛擬商品',
				}}
			/>
		</>
	)
}
