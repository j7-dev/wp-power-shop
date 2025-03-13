import { memo } from 'react'
import { useTable } from '@refinedev/antd'
import { Table, FormInstance, Spin, Button, TableProps, Card } from 'antd'

// import Filter, {
// 	initialFilteredValues,
// } from '@/components/product/ProductTable/Filter'
import { HttpError, useCreate } from '@refinedev/core'
import { TOrderBaseRecord, TOrderRecord } from '@/pages/admin/Orders/List/types'

// import { TFilterProps } from '@/components/product/ProductTable/types'1.3.
import useValueLabelMapper from '@/pages/admin/Orders/List/hooks/useValueLabelMapper'
import useColumns from '@/pages/admin/Orders/List/hooks/useColumns'
import { PlusOutlined } from '@ant-design/icons'
import DeleteButton from './DeleteButton'
import {
	useRowSelection,
	getDefaultPaginationProps,
	defaultTableProps,
	useEnv,
} from 'antd-toolkit'
import { FilterTags, objToCrudFilters } from 'antd-toolkit/refine'

const Main = () => {
	const env = useEnv()
	const { DOCS_POST_TYPE } = env
	const { tableProps, searchFormProps } = useTable<
		TOrderBaseRecord,
		HttpError

		// TFilterProps
	>({
		resource: 'orders',

		// onSearch,

		filters: {
			// initial: getInitialFilters(initialFilteredValues),
			permanent: objToCrudFilters({}),
		},
		pagination: {
			pageSize: 20,
		},
	})

	const { valueLabelMapper } = useValueLabelMapper()

	const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
		useRowSelection<TOrderBaseRecord>()

	const columns = useColumns()

	const { mutate: create, isLoading: isCreating } = useCreate({
		resource: 'orders',
		invalidates: ['list'],
		meta: {
			headers: { 'Content-Type': 'multipart/form-data;' },
		},
	})

	const createOrder = () => {
		create({
			values: {},
		})
	}

	return (
		<Spin spinning={tableProps?.loading as boolean}>
			{/* <Card title="篩選" className="mb-4">
				<Filter
					searchFormProps={searchFormProps}
					optionParams={{
						endpoint: 'docs/options',
					}}
				/>
				<div className="mt-2">
					<FilterTags<TFilterProps>
						form={{...searchFormProps?.form} as FormInstance<TFilterProps>}
						keyLabelMapper={keyLabelMapper}
						valueLabelMapper={valueLabelMapper}
						booleanKeys={[
							'featured',
							'downloadable',
							'virtual',
							'sold_individually',
						]}
					/>
				</div>
			</Card> */}
			<Card>
				<div className="mb-4 flex justify-between">
					<Button
						loading={isCreating}
						type="primary"
						icon={<PlusOutlined />}
						onClick={createOrder}
					>
						新增訂單
					</Button>
					<DeleteButton
						selectedRowKeys={selectedRowKeys}
						setSelectedRowKeys={setSelectedRowKeys}
					/>
				</div>
				<Table
					{...(defaultTableProps as unknown as TableProps<TOrderRecord>)}
					{...tableProps}
					pagination={{
						...tableProps.pagination,
						...getDefaultPaginationProps({ label: '訂單' }),
					}}
					rowSelection={rowSelection}
					columns={columns}
					rowKey={(record) => record.id.toString()}
				/>
			</Card>
		</Spin>
	)
}

export default memo(Main)
