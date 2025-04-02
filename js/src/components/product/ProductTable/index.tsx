import { memo } from 'react'
import { useTable } from '@refinedev/antd'
import { Table, FormInstance, Spin, TableProps, CardProps } from 'antd'
import { HttpError } from '@refinedev/core'
import { TProductRecord } from '@/pages/admin/Product/types'
import {
	useValueLabelMapper,
	useColumns,
} from '@/components/product/ProductTable/hooks'
import { useProductsOptions } from '@/hooks'
import {
	useRowSelection,
	defaultTableProps,
	getDefaultPaginationProps,
	useEnv,
	Card,
} from 'antd-toolkit'
import { productKeyLabelMapper } from 'antd-toolkit/wp'
import {
	ProductFilter,
	TProductFilterProps,
	onProductSearch as onSearch,
	FilterTags,
	objToCrudFilters,
	initialFilteredValues,
} from 'antd-toolkit/refine'

const ProductTableComponent = ({
	cardProps,
}: {
	cardProps?: CardProps & { showCard?: boolean }
}) => {
	const { BOUND_META_KEY } = useEnv()

	const { tableProps, searchFormProps } = useTable<
		TProductRecord,
		HttpError,
		TProductFilterProps
	>({
		resource: 'products',
		onSearch,
		filters: {
			initial: objToCrudFilters(initialFilteredValues),
			permanent: objToCrudFilters({
				meta_keys: [BOUND_META_KEY],
			}),
			defaultBehavior: 'replace',
		},
		pagination: {
			pageSize: 20,
		},
	})

	const { valueLabelMapper } = useValueLabelMapper()

	const { rowSelection } = useRowSelection<TProductRecord>({
		getCheckboxProps: (record) => {
			// 只有可變商品可選，變體不可選
			const isVariationProduct = record?.type?.includes('variation')
			return {
				disabled: !!isVariationProduct,
				className: isVariationProduct ? 'tw-hidden' : '',
			}
		},
	})

	const columns = useColumns()
	const options = useProductsOptions()

	return (
		<Spin spinning={tableProps?.loading as boolean}>
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
		</Spin>
	)
}

export const ProductTable = memo(ProductTableComponent)
