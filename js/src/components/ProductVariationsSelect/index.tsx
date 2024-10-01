import React, { useEffect } from 'react'
import { TAjaxProduct } from '@/types/custom'
import { useAtom, useAtomValue } from 'jotai'
import {
	selectedVariationIdAtom,
	isProductModalOpenAtom,
	selectedAttributesAtom,
} from '@/pages/PowerShopProducts/atom'
import { sortBy, toArray } from 'lodash-es'
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'

const ProductVariationsSelect: React.FC<{ product: TAjaxProduct }> = ({
	product,
}) => {
	const [
		selectedVariationId,
		setSelectedVariationId,
	] = useAtom(selectedVariationIdAtom)

	const [
		selectedAttributes,
		setSelectedAttributes,
	] = useAtom(selectedAttributesAtom)

	const isProductModalOpen = useAtomValue(isProductModalOpenAtom)

	const variations = product?.variations ?? []
	const formattedAttributes = product?.variation_attributes ?? {}
	const attributes = product?.attributes ?? []

	const handleClick = (attributeName: string, option: string) => () => {
		const otherSelectedAttribute = selectedAttributes.filter(
			(item) => item.name !== attributeName,
		)
		const itemToBeAdded = {
			name: attributeName,
			value: option ?? '',
		}
		const newSelected = [
			...otherSelectedAttribute,
			itemToBeAdded,
		]
		const order = Object.keys(formattedAttributes).map((a) => a)
		const sortedNewSelected = sortBy(newSelected, (item) => {
			const index = order.indexOf(item.name)
			return index !== -1 ? index : Infinity
		})

		setSelectedAttributes(sortedNewSelected)

		// use this instead if use wcStoreApi
		// const variationId = getVariationIdByAttributes(product, sortedNewSelected)

		const theVariation = variations.find((v) => {
			const theAttributes = v?.attributes

			return Object.keys(theAttributes).every((a) => {
				const theSelectedAttribute = sortedNewSelected.find(
					(s) =>
						`attribute_${decodeURIComponent(s.name.toLowerCase())}` ===
						decodeURIComponent(a.toLowerCase()),
				)

				return theSelectedAttribute?.value === theAttributes[a]
			})
		})

		if (theVariation) {
			setSelectedVariationId(theVariation.variation_id)
		} else {
			setSelectedVariationId(null)
		}
	}

	useEffect(() => {
		if (isProductModalOpen) {
			setSelectedAttributes([])
			setSelectedVariationId(null)
		}
	}, [isProductModalOpen])

	return (
		<>
			{Object.keys(formattedAttributes).map((attributeName) => {
				const attribute = attributes?.find((a) => a.slug === attributeName)
				const attributeOptions = attribute?.options || []

				const options = toArray(formattedAttributes[attributeName])
				const selectedOption = selectedAttributes.find(
					(item) => item.name === attributeName,
				) ?? { name: '', value: '' }
				return (
					<div key={attributeName} className="mb-4">
						<p className="mb-0">{attribute?.name}</p>
						<div className="flex flex-wrap">
							{options.map((option) => (
								<Button
									key={option}
									type={`${
										selectedOption.value === option ? 'primary' : 'default'
									}`}
									onClick={handleClick(attributeName, option)}
									size="small"
									className="mr-1 mb-1"
								>
									<span className="text-xs">
										{attributeOptions?.find((o) => o?.value === option)?.name}
									</span>
								</Button>
							))}
						</div>
					</div>
				)
			})}

			{!selectedVariationId && (
				<p className="m-0 text-gray-500 text-xs">
					<CloseCircleFilled className="mr-2 text-red-500" />
					未選擇商品屬性
				</p>
			)}
			{selectedVariationId && (
				<p className="m-0 text-gray-500 text-xs">
					<CheckCircleFilled className="mr-2 text-green-500" />
					已選擇商品屬性
				</p>
			)}
		</>
	)
}

export default ProductVariationsSelect
