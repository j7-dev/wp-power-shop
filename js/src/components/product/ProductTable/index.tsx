import { memo, useEffect } from 'react'
import { useTable } from '@refinedev/antd'
import { Table, FormInstance, TableProps, CardProps } from 'antd'
import { HttpError } from '@refinedev/core'
import { TProductRecord } from '@/components/product/types'
import {
	useValueLabelMapper,
	useColumns,
} from '@/components/product/ProductTable/hooks'
import { useProductsOptions } from '@/hooks'
import { selectedProductsAtom } from '@/components/product/ProductTable/atom'
import { useAtom } from 'jotai'
import BulkAction from '@/components/product/ProductTable/BulkAction'
import CreateButton from '@/components/product/ProductTable/Create'
import {
	useRowSelection,
	defaultTableProps,
	getDefaultPaginationProps,
	Card,
} from 'antd-toolkit'
import { productKeyLabelMapper, isVariation } from 'antd-toolkit/wp'
import {
	ProductFilter,
	TProductFilterProps,
	onProductSearch as onSearch,
	FilterTags,
	objToCrudFilters,
	initialFilteredValues,
	ActionArea,
	SelectedItem,
} from 'antd-toolkit/refine'

const ProductTableComponent = ({
	cardProps,
}: {
	cardProps?: CardProps & { showCard?: boolean }
}) => {
	const [selectedProducts, setSelectedProducts] = useAtom(selectedProductsAtom)
	const selectedProductIds = selectedProducts.map((product) => product.id)

	const { searchFormProps, tableProps, filters } = useTable<
		TProductRecord,
		HttpError,
		TProductFilterProps
	>({
		resource: 'products',
		onSearch,
		filters: {
			initial: objToCrudFilters(initialFilteredValues),
			permanent: objToCrudFilters({
				meta_keys: ['_variation_description'],
			}),
			defaultBehavior: 'replace',
		},
		pagination: {
			pageSize: 20,
		},
	})

	const { valueLabelMapper } = useValueLabelMapper()

	const currentAllKeys =
		tableProps?.dataSource?.map((record) => record?.id?.toString()) || []

	// 多選
	const { rowSelection, setSelectedRowKeys } = useRowSelection<TProductRecord>({
		getCheckboxProps: (record) => {
			// 只有可變商品可選，變體不可選
			const isVariationProduct = isVariation(record?.type as string)
			return {
				disabled: !!isVariationProduct,
				className: isVariationProduct ? 'tw-hidden' : '',
			}
		},
		onChange: (currentSelectedRowKeys: React.Key[]) => {
			setSelectedRowKeys(currentSelectedRowKeys)

			/** @type TProductRecord[] 不在這頁的已選擇商品 */
			const selectedProductsNotInCurrentPage = selectedProducts?.filter(
				(p) => !currentAllKeys?.includes(p?.id),
			)

			/** @type string[] 在這頁的已選擇商品 ids */
			const selectedProductIdsInCurrentPage = currentSelectedRowKeys?.map(
				(key) => key?.toString(),
			)

			const selectedProductsInCurrentPage =
				tableProps?.dataSource?.reduce((acc, record) => {
					if (selectedProductIdsInCurrentPage?.includes(record?.id)) {
						acc.push(record)
					}
					return acc
				}, [] as TProductRecord[]) || []

			setSelectedProducts(() => {
				// 把這頁的已選商品加上 不在這頁的已選商品
				const newKeys = new Set([
					...selectedProductsNotInCurrentPage,
					...selectedProductsInCurrentPage,
				])
				return [...newKeys]
			})
		},
	})

	// 換頁時，將已加入的商品全局狀態同步到當前頁面的 selectedRowKeys 狀態
	useEffect(() => {
		if (!tableProps?.loading) {
			const filteredKey =
				currentAllKeys?.filter((id) => selectedProductIds?.includes(id)) || []
			setSelectedRowKeys(filteredKey)
		}
	}, [
		JSON.stringify(filters),
		JSON.stringify(tableProps?.pagination),
		tableProps?.loading,
	])

	useEffect(() => {
		// 如果清空已選擇的用戶，連帶清空 selectedRowKeys (畫面上的打勾)
		if (selectedProducts.length === 0) {
			setSelectedRowKeys([])
		}
	}, [selectedProducts.length])

	useEffect(() => {
		// 剛載入組件時，清空已選擇的用戶
		setSelectedProducts([])
	}, [])

	const columns = useColumns()
	const options = useProductsOptions()

	return (
		<>
			<Card title="篩選" className="mb-4">
				<ProductFilter searchFormProps={searchFormProps} options={options} />
				<div className="mt-2">
					<FilterTags<TProductFilterProps>
						form={
							{ ...searchFormProps?.form } as FormInstance<TProductFilterProps>
						}
						keyLabelMapper={productKeyLabelMapper}
						valueLabelMapper={valueLabelMapper}
						booleanKeys={[
							'featured',
							'downloadable',
							'virtual',
							'sold_individually',
						]}
					/>
				</div>
			</Card>
			<Card>
				<CreateButton className="mb-4" />
				<Table
					{...(defaultTableProps as unknown as TableProps<TProductRecord>)}
					{...tableProps}
					pagination={{
						...tableProps.pagination,
						...getDefaultPaginationProps({ label: '商品' }),
					}}
					rowSelection={rowSelection}
					columns={columns}
					scroll={{
						x: 1400,
					}}
				/>
			</Card>
			{!!selectedProducts.length && (
				<ActionArea>
					<BulkAction />
					<SelectedItem
						ids={selectedProductIds}
						label="商品"
						onClear={() => {
							setSelectedProducts([])
						}}
						onSelected={() => {
							const searchForm = searchFormProps?.form
							if (!searchForm) return
							searchForm.resetFields()
							searchForm.setFieldsValue({
								include: selectedProductIds,
							})
							searchForm.submit()
						}}
					/>
				</ActionArea>
			)}
		</>
	)
}

export const ProductTable = memo(ProductTableComponent)
