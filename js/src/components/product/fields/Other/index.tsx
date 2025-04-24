import { Switch } from 'antd-toolkit'
import { TProductType, isVariation as checkIsVariation } from 'antd-toolkit/wp'

export const Other = ({ id, type }: { id?: string; type: TProductType }) => {
	const isVariation = checkIsVariation(type as string)
	return (
		<>
			<Switch
				formItemProps={{
					name: id ? [id, 'virtual'] : ['virtual'],
					label: '虛擬商品',
				}}
				switchProps={{
					size: 'small',
				}}
			/>
			<Switch
				formItemProps={{
					name: id ? [id, 'downloadable'] : ['downloadable'],
					label: '可下載',
				}}
				switchProps={{
					size: 'small',
				}}
			/>
			{!isVariation && (
				<>
					<Switch
						formItemProps={{
							name: id ? [id, 'featured'] : ['featured'],
							label: '精選商品',
						}}
						switchProps={{
							size: 'small',
						}}
					/>
					<Switch
						formItemProps={{
							name: id ? [id, 'sold_individually'] : ['sold_individually'],
							label: '限購一件',
						}}
						switchProps={{
							size: 'small',
						}}
					/>
					<Switch
						formItemProps={{
							name: id ? [id, 'reviews_allowed'] : ['reviews_allowed'],
							label: '允許評論',
						}}
						switchProps={{
							size: 'small',
						}}
					/>
				</>
			)}

			{isVariation && (
				<>
					<Switch
						formItemProps={{
							name: id ? [id, 'status'] : ['status'],
							label: '啟用',
							normalize: (value) => (value ? 'publish' : 'private'),
							getValueProps: (value) =>
								value === 'publish' ? { checked: true } : {},
						}}
						switchProps={{
							size: 'small',
						}}
					/>
				</>
			)}
		</>
	)
}
