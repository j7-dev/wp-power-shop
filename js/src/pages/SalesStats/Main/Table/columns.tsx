import type { ColumnsType } from 'antd/es/table'
import { TOrder, TOrderItem } from '@/pages/SalesStats/types'
import { siteUrl, getOrderStatus } from '@/utils'
import { LinkOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

export const columns: ColumnsType<TOrder> = [
  {
    title: <p className="m-0 text-center">訂單編號</p>,
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    render: (order_id: string) => (
      <a
        target="_blank"
        href={`${siteUrl}/wp-admin/post.php?post=${order_id}&action=edit`}
        rel="noreferrer"
      >
        #{order_id} <LinkOutlined />
      </a>
    ),
  },
  {
    title: <p className="m-0 text-center">顧客</p>,
    dataIndex: 'customer',
    key: 'customer',
    align: 'center',
    render: (customer: { id: number; display_name: string }) => {
      const id = customer?.id || 0
      const displayName = customer?.display_name || ''
      return (
        <>
          {id ? (
            <>
              <a
                target="_blank"
                href={`${siteUrl}/wp-admin/user-edit.php?user_id=${id}`}
                rel="noreferrer"
              >
                {displayName} <LinkOutlined />
              </a>
              <sub className="ml-2">#{id}</sub>
            </>
          ) : (
            <>
              {displayName} <sub className="ml-2">訪客</sub>
            </>
          )}
        </>
      )
    },
  },
  {
    title: <p className="m-0 text-center">購買產品</p>,
    dataIndex: 'items',
    key: 'items',
    render: (items: TOrderItem[], order) => {
      return (
        <>
          {items.map((item) => (
            <p key={item.item_id} className="my-1 text-xs">
              {item.name} x {item.quantity} ${item.line_total}
            </p>
          ))}
          <p className="my-1 text-xs">
            運費 {order.shipping_method} ${order.shipping}
          </p>
        </>
      )
    },
  },

  {
    title: <p className="m-0 text-center">總金額</p>,
    dataIndex: 'total',
    key: 'total',
    align: 'right',
    render: (total: string) => (
      <span>$ {parseInt(total, 10).toLocaleString()}</span>
    ),
  },
  {
    title: <p className="m-0 text-center">訂單狀態</p>,
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: string) => {
      const { label, color } = getOrderStatus(status)
      return <Tag color={color}>{label}</Tag>
    },
  },
]
