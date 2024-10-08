import { useEffect } from 'react'
import { Form, InputNumber, Tooltip, Input } from 'antd'
import { TProductVariation, TSimpleAttribute } from '@/types/wcRestApi'
import defaultImage from '@/assets/images/defaultImage.jpg'
import { nanoid } from 'nanoid'
import { TPSMeta, TPSVariation } from '@/types'
import { showBuyerCount } from '@/utils'

const getPrices = (
	mv: TPSVariation | null | undefined,
	v: TProductVariation,
) => {
	const matchProductSalesPrice = Number(mv?.salesPrice ?? '0')
	const matchProductRegularPrice = Number(mv?.regularPrice ?? '0')

	if (!matchProductSalesPrice && !matchProductRegularPrice) {
		return {
			salesPrice: Number(v?.sale_price ?? '0'),
			regularPrice: Number(v?.regular_price ?? '0'),
		}
	}
	return {
		salesPrice: matchProductSalesPrice,
		regularPrice: matchProductRegularPrice,
	}
}

const Variation: React.FC<{
	variation: TProductVariation
	parentIndex: number
	parentId: number
	index: number
	matchProduct: TPSMeta | undefined
}> = ({ variation, parentIndex, parentId, index, matchProduct }) => {
	const id = variation?.id ?? 0
	const matchVariation = !!matchProduct
		? (matchProduct?.variations ?? [])?.find((v) => v.variationId === id)
		: null
	const attributes = (variation?.attributes ?? []) as TSimpleAttribute[]
	const name = attributes.map((a) => (
		<span key={nanoid()} className="mr-2 font-medium">
			<Tooltip title={a?.name}>{a?.option}</Tooltip>
		</span>
	))
	const form = Form.useFormInstance()

	const imageSrc = variation?.image?.src ?? defaultImage
	const { salesPrice, regularPrice } = getPrices(matchVariation, variation)
	const extraBuyerCount = matchVariation?.extraBuyerCount || 0

	useEffect(() => {
		form.setFieldsValue({
			[parentIndex]: {
				productId: parentId,
				variations: {
					[index]: {
						variationId: id,
						regularPrice,
						salesPrice,
						extraBuyerCount,
					},
				},
			},
		})
	}, [
		id,
		parentIndex,
		index,
	])

	return (
		<>
			<div className="flex justify-between mt-8">
				<div className="flex flex-1 mr-4">
					<div className="mr-4">
						<img className="h-16 w-16 rounded-xl object-cover" src={imageSrc} />
						<p className="m-0 text-xs text-gray-400">ID: #{id}</p>
						<p className="m-0 text-xs text-gray-400">
							原價: {variation?.regular_price ?? ''}
						</p>
						<p className="m-0 text-xs text-gray-400">
							特價: {variation?.sale_price ?? ''}
						</p>
					</div>
					<div className="flex-1">
						{name}
						<div className="flex">
							<Form.Item
								name={[
									parentIndex,
									'variations',
									index,
									'variationId',
								]}
								initialValue={id}
								hidden
							>
								<Input />
							</Form.Item>
							<Form.Item
								name={[
									parentIndex,
									'variations',
									index,
									'regularPrice',
								]}
								label="原價"
								className="w-full mr-4"
								initialValue={regularPrice}
							>
								<InputNumber min={0} className="w-full" />
							</Form.Item>
							<Form.Item
								name={[
									parentIndex,
									'variations',
									index,
									'salesPrice',
								]}
								label="特價"
								className="w-full mr-4"
								initialValue={salesPrice}
							>
								<InputNumber min={0} className="w-full" />
							</Form.Item>
							<Form.Item
								name={[
									parentIndex,
									'variations',
									index,
									'extraBuyerCount',
								]}
								label="灌水購買人數"
								help="前台會顯示 真實購買人數 + 灌水購買人數"
								className="w-full"
								hidden={!showBuyerCount}
							>
								<InputNumber min={0} className="w-full" />
							</Form.Item>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Variation
