import React from 'react'
import { Table } from 'antd'
import { orderDataAtom } from '@/pages/SalesStats/atom'
import { useAtomValue } from 'jotai'
import { columns } from './columns'

const TableComponent: React.FC = () => {
  const orderData = useAtomValue(orderDataAtom)
  const orders = orderData?.list ?? []

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={orders}
      pagination={false}
    />
  )
}

export default TableComponent
