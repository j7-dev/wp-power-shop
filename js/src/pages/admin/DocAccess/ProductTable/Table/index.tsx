import { useEffect, memo } from 'react'
import { useTable } from '@refinedev/antd'
import { Table, FormInstance, Spin, TableProps, Card, Form } from 'antd'
import { HttpError } from '@refinedev/core'
import { TProductRecord, TProductVariation, TBoundDocData } from '@/types'
import useValueLabelMapper from '../hooks/useValueLabelMapper'

// import {
// 	BindCourses,
// 	UpdateBoundCourses,
// 	UnbindCourses,
// } from '@/components/product'
import useColumns from '../hooks/useColumns'
import { useGCDItems, useProductsOptions } from '@/hooks'
import {
	useRowSelection,
	Limit,
	defaultTableProps,
	getDefaultPaginationProps,
	useEnv,
} from 'antd-toolkit'
import { productKeyLabelMapper } from 'antd-toolkit/wp'
import {
	BindItems,
	UnbindItems,
	UpdateBoundItems,
	ProductFilter,
	TProductFilterProps,
	onProductSearch as onSearch,
	FilterTags,
	objToCrudFilters,
	initialFilteredValues,
} from 'antd-toolkit/refine'

const Main = () => {
	const { DOCS_POST_TYPE, BOUND_META_KEY } = useEnv()
	const [form] = Form.useForm()
	const watchLimitType = Form.useWatch(['limit_type'], form)

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
		},
	})

	const { valueLabelMapper } = useValueLabelMapper()

	const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
		useRowSelection<TProductRecord>({
			getCheckboxProps: (record) => {
				// 當觀看期限選擇 follow_subscription "跟隨訂閱" 時，只能選擇訂閱商品
				const isSubscriptionProduct = record?.type?.includes('subscription')
				const disabledForFollowSubscription =
					!isSubscriptionProduct && watchLimitType === 'follow_subscription'

				// 可變商品的母體不必可選，變體可選就好
				const isVariableProduct = record?.type?.startsWith('variable')
				return {
					disabled: !!isVariableProduct || disabledForFollowSubscription,
					className: isVariableProduct ? 'tw-hidden' : '',
				}
			},
		})

	// 當觀看期限選擇 follow_subscription "跟隨訂閱" 時，只能選擇訂閱商品
	useEffect(() => {
		if ('follow_subscription' === watchLimitType) {
			const subscriptionProductIds = tableProps?.dataSource?.reduce(
				(acc, product) => {
					if ('subscription' === product.type) {
						acc.push(product.id)
					}
					if ('variable-subscription' === product.type) {
						const variationIds =
							product?.children?.map((variation) => variation.id) || []
						acc.push(...variationIds)
					}
					return acc
				},
				[] as string[],
			)

			const removeNonSubscriptionProductIds = selectedRowKeys?.filter((id) =>
				subscriptionProductIds?.includes(id as string),
			)
			setSelectedRowKeys(removeNonSubscriptionProductIds)
		}
	}, [watchLimitType])

	const columns = useColumns()

	// 已選商品身上的 知識庫觀看權限
	const productAllBindDocsData = selectedRowKeys?.map((key) => {
		return tableProps?.dataSource?.find((product) => product.id === key)
			?.bound_docs_data
	})

	// 已選商品變體身上的 知識庫觀看權限
	const variationAllBindDocsData = selectedRowKeys?.map((key) => {
		const allVariations = tableProps?.dataSource?.reduce((acc, product) => {
			if (product.children) {
				acc.push(...(product.children as TProductVariation[]))
			}
			return acc
		}, [] as TProductVariation[])
		return allVariations?.find((product) => product.id === key)?.bound_docs_data
	})

	const selectedAllBindDocsData = [
		...productAllBindDocsData,
		...variationAllBindDocsData,
	].filter((item) => item !== undefined)

	// 取得最大公約數的課程
	const { GcdItemsTags, selectedGCDs, setSelectedGCDs, gcdItems } =
		useGCDItems<TBoundDocData>({
			allItems: selectedAllBindDocsData,
		})

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
				<Form layout="vertical" form={form}>
					<div className="grid grid-cols-4 gap-x-6">
						<div>
							<Limit />
						</div>
						<div className="col-span-3">
							<div className="mb-4">
								<BindItems
									product_ids={selectedRowKeys as string[]}
									label="知識庫"
									useSelectProps={{
										resource: 'posts',
										filters: objToCrudFilters({
											post_type: DOCS_POST_TYPE,
											meta_key: 'need_access',
											meta_value: 'yes',
										}),
									}}
									meta_key={BOUND_META_KEY}
								/>
							</div>
							<div className="mb-4 flex gap-x-6">
								<div>
									<label className="tw-block mb-2">批量操作</label>
									<div className="flex gap-x-4">
										<UpdateBoundItems
											product_ids={selectedRowKeys as string[]}
											item_ids={selectedGCDs}
											meta_key={BOUND_META_KEY}
											onSettled={() => {
												setSelectedGCDs([])
											}}
										/>
										<UnbindItems
											product_ids={selectedRowKeys as string[]}
											item_ids={selectedGCDs}
											meta_key={BOUND_META_KEY}
											onSettled={() => {
												setSelectedGCDs([])
											}}
										/>
									</div>
								</div>
								{!!gcdItems.length && (
									<div className="flex-1">
										<label className="tw-block mb-2">選擇已綁定的知識庫</label>
										<GcdItemsTags />
									</div>
								)}
							</div>
						</div>
					</div>
				</Form>
				<Table
					{...(defaultTableProps as unknown as TableProps<TProductRecord>)}
					{...tableProps}
					pagination={{
						...tableProps.pagination,
						...getDefaultPaginationProps({ label: '商品' }),
					}}
					rowSelection={rowSelection}
					columns={columns}
				/>
			</Card>
		</Spin>
	)
}

export default memo(Main)
