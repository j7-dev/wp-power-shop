import { SizeType } from 'antd/es/config-provider/SizeContext'
import { SwitchSize } from 'antd/es/switch'
import { Switch } from 'antd-toolkit'
import { TProductType, isVariation as checkIsVariation } from 'antd-toolkit/wp'

export const Other = ({
	id,
	type,
	size,
}: {
	id?: string
	type: TProductType
	size?: SizeType
}) => {
	const isVariation = checkIsVariation(type as string)
	const switchSize = ['small', 'default'].includes(size || 'default')
		? (size as SwitchSize)
		: 'default'
	return (
		<>
			<Switch
				formItemProps={{
					name: id ? [id, 'virtual'] : ['virtual'],
					label: '虛擬商品',
				}}
				switchProps={{
					size: switchSize,
				}}
			/>
			<Switch
				formItemProps={{
					name: id ? [id, 'downloadable'] : ['downloadable'],
					label: '可下載',
				}}
				switchProps={{
					size: switchSize,
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
							size: switchSize,
						}}
					/>
					<Switch
						formItemProps={{
							name: id ? [id, 'sold_individually'] : ['sold_individually'],
							label: '限購一件',
							help:
								switchSize === 'small' ? undefined : '限制每筆訂單購買一項商品',
							tooltip:
								switchSize === 'small'
									? undefined
									: '勾選即可讓顧客在一筆訂單中僅能購買一項商品。 此功能對於限量商品非常實用，例如藝術品或手工商品。',
						}}
						switchProps={{
							size: switchSize,
						}}
					/>
					<Switch
						formItemProps={{
							name: id ? [id, 'reviews_allowed'] : ['reviews_allowed'],
							label: '允許評論',
						}}
						switchProps={{
							size: switchSize,
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
							size: switchSize,
						}}
					/>
				</>
			)}
		</>
	)
}
