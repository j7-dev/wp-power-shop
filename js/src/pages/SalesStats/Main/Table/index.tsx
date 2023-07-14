import React from 'react'
import { Table, Pagination, PaginationProps } from 'antd'
import { orderDataAtom, paginationAtom } from '@/pages/SalesStats/atom'
import { useAtomValue, useAtom } from 'jotai'
import { columns } from './columns'

const TableComponent: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const orderData = useAtomValue(orderDataAtom)
  const [
    pagination,
    setPagination,
  ] = useAtom(paginationAtom)
  const { paged, limit } = pagination
  const orders = orderData?.list ?? []
  const total = orderData?.info?.total ?? 0

  const onChange: PaginationProps['onChange'] = (thePaged, theLimit) => {
    setPagination({
      paged: thePaged,
      limit: theLimit,
    })
  }

  return (
    <>
      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={orders}
        pagination={false}
      />
      <div className="mt-4 text-right">
        <Pagination
          current={paged}
          onChange={onChange}
          onShowSizeChange={onChange}
          total={total}
          showSizeChanger
          showTotal={(v) => `全部 ${v} 筆訂單`}
        />
      </div>
    </>
  )
}

export default TableComponent
