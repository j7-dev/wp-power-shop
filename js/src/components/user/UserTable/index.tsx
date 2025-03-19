import React, { memo, useEffect } from 'react'
import { useTable } from '@refinedev/antd'
import { TUserRecord } from '@/pages/admin/Users/types'
import { Table, TableProps, FormInstance, CardProps, Button } from 'antd'
import { DeleteOutlined, MailOutlined } from '@ant-design/icons'
import useColumns from './hooks/useColumns'
import { useGCDItems } from '@/hooks'
import Filter, { TFilterValues } from './Filter'
import { HttpError } from '@refinedev/core'
import { keyLabelMapper } from './utils'
import { selectedUserIdsAtom } from './atom'
import { useAtom } from 'jotai'
import SelectedUser from './SelectedUser'
import Card from './Card'
import { TGrantedDoc } from '@/types'
import {
	useRowSelection,
	getDefaultPaginationProps,
	defaultTableProps,
	useEnv,
} from 'antd-toolkit'

import { FilterTags, objToCrudFilters, ActionArea } from 'antd-toolkit/refine'

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
	const { rowSelection, setSelectedRowKeys, selectedRowKeys } =
		useRowSelection<TUserRecord>({
			onChange: (currentSelectedRowKeys: React.Key[]) => {
				setSelectedRowKeys(currentSelectedRowKeys)

				/**
				 * 不在這頁的已選擇用戶
				 * @type string[]
				 */
				const setSelectedUserIdsNotInCurrentPage = selectedUserIds.filter(
					(selectedUserId) => !currentAllKeys.includes(selectedUserId),
				)

				/**
				 * 在這頁的已選擇用戶
				 * @type string[]
				 */
				const currentSelectedRowKeysStringify = currentSelectedRowKeys.map(
					(key) => key.toString(),
				)

				setSelectedUserIds(() => {
					// 把這頁的已選用戶加上 不在這頁的已選用戶
					const newKeys = new Set([
						...setSelectedUserIdsNotInCurrentPage,
						...currentSelectedRowKeysStringify,
					])
					return [...newKeys]
				})
			},
		})

	/*
	 * 換頁時，將已加入的商品全局狀態同步到當前頁面的 selectedRowKeys 狀態
	 */
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

	const selectedAllAVLCourses = selectedRowKeys
		.map((key) => {
			return tableProps?.dataSource?.find((user) => user.id === key)
				?.granted_docs
		})
		.filter((courses) => courses !== undefined)

	// 取得最大公約數的課程
	const { GcdItemsTags, selectedGCDs, setSelectedGCDs, gcdItems } =
		useGCDItems<TGrantedDoc>({
			allItems: selectedAllAVLCourses,
		})

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
					{...overrideTableProps}
				/>
			</Card>
			{!!selectedUserIds.length && (
				<ActionArea>
					<div className="flex gap-x-6 justify-between">
						<div>
							<label className="tw-block mb-2">批次操作</label>
							<div className="flex gap-x-2">
								<Button type="primary" icon={<MailOutlined />} className="mr-2">
									批次傳送密碼重設連結
									{selectedUserIds.length ? ` (${selectedUserIds.length})` : ''}
								</Button>
								<Button
									type="primary"
									danger
									icon={<DeleteOutlined />}
									// onClick={show}
								>
									批次刪除用戶
									{selectedUserIds.length ? ` (${selectedUserIds.length})` : ''}
								</Button>
							</div>
						</div>
						{!!gcdItems.length && (
							<div className="flex-1">
								<label className="tw-block mb-2">選擇知識庫</label>
								<GcdItemsTags />
							</div>
						)}
					</div>
					<SelectedUser
						user_ids={selectedUserIds}
						onClear={() => {
							setSelectedUserIds([])
						}}
						onSelected={() => {
							const searchForm = searchFormProps?.form
							if (!searchForm) return
							searchForm.setFieldValue(['include'], selectedUserIds)
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
export { default as SelectedUser } from './SelectedUser'
