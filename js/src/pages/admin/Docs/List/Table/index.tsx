import { memo } from 'react'
import { useTable } from '@refinedev/antd'
import { Table, FormInstance, Spin, Button, TableProps, Card } from 'antd'

// import Filter, {
// 	initialFilteredValues,
// } from '@/components/product/ProductTable/Filter'
import { HttpError, useCreate } from '@refinedev/core'
import { TDocBaseRecord, TDocRecord } from '@/pages/admin/Docs/List/types'

// import { TFilterProps } from '@/components/product/ProductTable/types'1.3.
import useValueLabelMapper from '@/pages/admin/Docs/List/hooks/useValueLabelMapper'
import useColumns from '@/pages/admin/Docs/List/hooks/useColumns'
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
		TDocBaseRecord,
		HttpError

		// TFilterProps
	>({
		resource: 'posts',

		// onSearch,

		filters: {
			// initial: getInitialFilters(initialFilteredValues),
			permanent: objToCrudFilters({
				post_type: DOCS_POST_TYPE,
				meta_keys: ['need_access', 'editor'],
			}),
		},
	})

	const { valueLabelMapper } = useValueLabelMapper()

	const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
		useRowSelection<TDocBaseRecord>()

	const columns = useColumns()

	const { mutate: create, isLoading: isCreating } = useCreate({
		resource: 'posts',
		invalidates: ['list'],
		meta: {
			headers: { 'Content-Type': 'multipart/form-data;' },
		},
	})

	const createKnowledgeBase = () => {
		create({
			values: {
				name: '新知識庫',
				post_type: DOCS_POST_TYPE,
			},
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
						onClick={createKnowledgeBase}
					>
						新增知識庫
					</Button>
					<DeleteButton
						selectedRowKeys={selectedRowKeys}
						setSelectedRowKeys={setSelectedRowKeys}
					/>
				</div>
				<Table
					{...(defaultTableProps as unknown as TableProps<TDocRecord>)}
					{...tableProps}
					pagination={{
						...tableProps.pagination,
						...getDefaultPaginationProps({ label: '知識庫' }),
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
