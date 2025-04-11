import { Switch } from 'antd-toolkit'

export const Other = ({ index }: { index: number }) => {
	return (
		<div className="grid grid-cols-2 gap-x-2">
			<Switch
				formItemProps={{
					name: [index, 'featured'],
					label: '精選商品',
				}}
				switchProps={{
					size: 'small',
				}}
			/>
			<Switch
				formItemProps={{
					name: [index, 'virtual'],
					label: '虛擬商品',
				}}
				switchProps={{
					size: 'small',
				}}
			/>
			<Switch
				formItemProps={{
					name: [index, 'sold_individually'],
					label: '限購一件',
				}}
				switchProps={{
					size: 'small',
				}}
			/>
			<Switch
				formItemProps={{
					name: [index, 'reviews_allowed'],
					label: '允許評論',
				}}
				switchProps={{
					size: 'small',
				}}
			/>
		</div>
	)
}
