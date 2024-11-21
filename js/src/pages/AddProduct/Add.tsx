import { useState, memo, useEffect } from 'react'
import { Select, Button, Typography, Form } from 'antd'
import { useMany } from '@/hooks'
import { TProduct, TProductCat } from '@/types/wcRestApi'
import { renderHTML, getProductImageSrc } from '@/utils'
import { addedProductsAtom, isChangeAtom } from './atoms'
import { useAtom, useSetAtom } from 'jotai'
import { debounce } from 'lodash-es'

const { Paragraph } = Typography

const renderItem = (product: TProduct) => {
	const imageSrc = getProductImageSrc(product)

	return (
		<div className="flex items-start justify-between">
			<div className="flex items-start">
				<img
					className="w-8 h-8 object-cover mt-1 mr-2 rounded-md"
					src={imageSrc}
				/>
				<Paragraph ellipsis style={{ width: 240 }}>
					{product?.name ?? '未知產品'}
				</Paragraph>
				{/* {renderHTML()} */}
			</div>

			<div>{renderHTML(product?.price_html)}</div>
		</div>
	)
}

const Add = () => {
	const setIsChange = useSetAtom(isChangeAtom)
	const [
		addedProducts,
		setAddedProducts,
	] = useAtom(addedProductsAtom)

	const [
		selectedCatId,
		setSelectedCatId,
	] = useState<number | undefined>(undefined)
	const [
		selectedProductId,
		setSelectedProductId,
	] = useState<number | undefined>(undefined)
	const productCatsResult = useMany({
		resource: '/product_categories',
		dataProvider: 'power-shop',
	})

	const [search, setSearch] = useState<string | undefined>(undefined)

	const productCats: TProductCat[] = productCatsResult?.data?.data ?? []

	const productCartItems = productCats.map((cat) => ({
		value: cat.id,
		label: cat?.name ?? '未知分類',
	}))

	const handleChangeProductCat = (value: number) => {
		setSelectedCatId(value)
		setSelectedProductId(undefined)
	}

	const productResult = useMany({
		resource: 'products',
		dataProvider: 'wc',
		args: {
			status: 'publish',
			per_page: 100,
			category: selectedCatId,
			orderby: 'title',
			order: 'asc',
			search,
		},
		queryOptions: {
			enabled: !!selectedCatId,
		},
	})

	const rawProducts: TProduct[] = productResult?.data?.data ?? []
	const products = rawProducts.filter(
		(product) => product.type === 'simple' || product.type === 'variable',
	)

	const productItems = products.map((product) => {
		const disabled = addedProducts.some(
			(addedProduct) => addedProduct?.id === product.id,
		)
		return {
			value: product.id,
			label: renderItem(product),
			disabled,
		}
	})

	const handleChangeProduct = (value: number) => {
		setSelectedProductId(value)
	}

	const handleAddProductBottom = () => {
		const selectedProduct = products.find(
			(product) => product.id === selectedProductId,
		)
		if (!!selectedProduct) {
			setAddedProducts([
				...addedProducts,
				selectedProduct,
			])
			setIsChange(true)
		}
	}

	const form = Form.useFormInstance()

	const handleAddProductTop = () => {
		const selectedProduct = products.find(
			(product) => product.id === selectedProductId,
		)
		if (!!selectedProduct) {
			// 改變了主畫面的商品順序

			setAddedProducts([
				selectedProduct,
				...addedProducts,
			])
			setIsChange(true)

			// 同時也要改變表單順序
			const values = form.getFieldsValue() // 舊的
			const valuesInArray = Object.values(values)
			const newValuesInArray = [
				{
					productId: selectedProduct.id,
					regularPrice: selectedProduct.regular_price,
					salesPrice: selectedProduct.sale_price,
					productType: selectedProduct.type,
					extraBuyerCount: 0,
				},
				...valuesInArray,
			]
			form.setFieldsValue(newValuesInArray)

			// console.log('⭐  從頂部新增後:', newValuesInArray)
		}
	}

	const btnDisabled =
		!selectedProductId ||
		addedProducts.some((addedProduct) => addedProduct?.id === selectedProductId)

	useEffect(() => {
		setSearch(undefined)
	}, [selectedCatId])

	return (
		<div className="mb-8">
			<p className="mb-2 text-[1rem] font-semibold">選擇要加入的商品</p>

			<div className="flex md:flex-row flex-col gap-2">
				<Select
					loading={productCatsResult.isLoading}
					disabled={productCatsResult.isLoading}
					className="w-full mb-2 md:mb-0"
					allowClear
					size="large"
					showSearch
					placeholder="選擇商品分類"
					optionFilterProp="children"
					optionLabelProp="label"
					filterOption={(input, option) =>
						(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
					}
					filterSort={(optionA, optionB) =>
						(optionA?.label ?? '')
							.toLowerCase()
							.localeCompare((optionB?.label ?? '').toLowerCase())
					}
					options={productCartItems}
					onChange={handleChangeProductCat}
				/>
				<Select
					loading={productResult.isLoading && !!selectedCatId}
					disabled={!selectedCatId || productResult.isLoading}
					className="w-full mb-2 md:mb-0"
					allowClear
					size="large"
					showSearch
					value={selectedProductId}
					placeholder="選擇產品"
					optionFilterProp="children"
					options={productItems}
					onSearch={(value) => {
						if ('' !== value) {
							debounce(() => {
								setSearch(value)
							}, 1000)()
						}
					}}
					optionLabelProp="label"
					onChange={handleChangeProduct}
					filterOption={false}

					// filterOption={(input, option) => {
					// 	const id = option?.value ?? 0
					// 	const theProduct = products.find((product) => product.id === id)

					// 	return (theProduct?.name ?? '')
					// 		.toLowerCase()
					// 		.includes(input.toLowerCase())
					// }}
				/>
				<div className="flex gap-2">
					<Button
						disabled={btnDisabled}
						size="large"
						type="primary"
						className="mx-0 w-1/2"
						onClick={handleAddProductBottom}
					>
						從底部新增
					</Button>
					<Button
						disabled={btnDisabled}
						size="large"
						type="primary"
						className="mx-0 w-1/2"
						onClick={handleAddProductTop}
					>
						從頂部新增
					</Button>
				</div>
			</div>
		</div>
	)
}

export default memo(Add)
