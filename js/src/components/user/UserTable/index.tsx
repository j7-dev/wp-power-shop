import React, { memo, useEffect } from 'react'
import { useTable } from '@refinedev/antd'
import { TUserRecord } from '@/components/user/types'
import { Table, TableProps, FormInstance, CardProps } from 'antd'
import useColumns from './hooks/useColumns'
import Filter, { TFilterValues } from './Filter'
import { HttpError } from '@refinedev/core'
import { keyLabelMapper } from './utils'
import { selectedUserIdsAtom } from './atom'
import { useAtom } from 'jotai'
import BulkAction from './BulkAction'
import {
	useRowSelection,
	getDefaultPaginationProps,
	defaultTableProps,
	Card,
} from 'antd-toolkit'
import {
	FilterTags,
	objToCrudFilters,
	ActionArea,
	SelectedItem,
} from 'antd-toolkit/refine'

const UserTableComponent = ({
	tableProps: overrideTableProps,
	cardProps,
	initialValues = {},
}: {
	tableProps?: TableProps<TUserRecord>
	cardProps?: CardProps & { showCard?: boolean }
	initialValues?: TFilterValues
}) => {
	const [selectedUserIds, setSelectedUserIds] = useAtom(selectedUserIdsAtom)

	const { searchFormProps, tableProps, filters } = useTable<
		TUserRecord,
		HttpError,
		TFilterValues
	>({
		resource: 'users',
		pagination: {
			pageSize: 20,
		},
		filters: {
			initial: objToCrudFilters(initialValues),
			defaultBehavior: 'replace',
		},
		onSearch: (values) => objToCrudFilters(values),
	})

	const currentAllKeys =
		tableProps?.dataSource?.map((record) => record?.id.toString()) || []

	// 多選
	const { rowSelection, setSelectedRowKeys } = useRowSelection<TUserRecord>({
		onChange: (currentSelectedRowKeys: React.Key[]) => {
			setSelectedRowKeys(currentSelectedRowKeys)

			/** @type string[] 不在這頁的已選擇用戶 */
			const selectedUserIdsNotInCurrentPage = selectedUserIds.filter(
				(selectedUserId) => !currentAllKeys.includes(selectedUserId),
			)

			/** @type string[] 在這頁的已選擇用戶 */
			const currentSelectedRowKeysStringify = currentSelectedRowKeys.map(
				(key) => key.toString(),
			)

			setSelectedUserIds(() => {
				// 把這頁的已選用戶加上 不在這頁的已選用戶
				const newKeys = new Set([
					...selectedUserIdsNotInCurrentPage,
					...currentSelectedRowKeysStringify,
				])
				return [...newKeys]
			})
		},
	})

	// 換頁時，將已加入的用戶全局狀態同步到當前頁面的 selectedRowKeys 狀態
	useEffect(() => {
		if (!tableProps?.loading) {
			const filteredKey =
				currentAllKeys?.filter((id) => selectedUserIds?.includes(id)) || []
			setSelectedRowKeys(filteredKey)
		}
	}, [
		JSON.stringify(filters),
		JSON.stringify(tableProps?.pagination),
		tableProps?.loading,
	])

	useEffect(() => {
		// 如果清空已選擇的用戶，連帶清空 selectedRowKeys (畫面上的打勾)
		if (selectedUserIds.length === 0) {
			setSelectedRowKeys([])
		}
	}, [selectedUserIds.length])

	useEffect(() => {
		// 剛載入組件時，清空已選擇的用戶
		setSelectedUserIds([])
	}, [])

	const columns = useColumns()

	return (
		<>
			<Card title="篩選" variant="borderless" className="mb-4" {...cardProps}>
				<Filter formProps={searchFormProps} initialValues={initialValues} />
				<FilterTags<TFilterValues>
					form={{ ...searchFormProps?.form } as FormInstance<TFilterValues>}
					keyLabelMapper={keyLabelMapper}
				/>
			</Card>
			<Card variant="borderless" {...cardProps}>
				<Table
					{...(defaultTableProps as unknown as TableProps<TUserRecord>)}
					{...tableProps}
					className="mt-4"
					columns={columns}
					rowSelection={rowSelection}
					pagination={{
						...tableProps.pagination,
						...getDefaultPaginationProps({ label: '用戶' }),
					}}
					scroll={{
						x: 1400,
					}}
					{...overrideTableProps}
				/>
			</Card>
			{!!selectedUserIds.length && (
				<ActionArea>
					<div className="flex gap-x-6 justify-between">
						<div>
							<label className="tw-block mb-2">批次操作</label>
							<BulkAction />
						</div>
					</div>
					<SelectedItem
						ids={selectedUserIds}
						label="用戶"
						onClear={() => {
							setSelectedUserIds([])
						}}
						onSelected={() => {
							const searchForm = searchFormProps?.form
							if (!searchForm) return
							searchForm.resetFields()
							searchForm.setFieldsValue({
								include: selectedUserIds,
							})
							searchForm.submit()
						}}
					/>
				</ActionArea>
			)}
		</>
	)
}

export const UserTable = memo(UserTableComponent)
export * from './atom'
