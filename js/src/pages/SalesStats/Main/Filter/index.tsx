import { DatePicker, Select, Input, Button, Row, Col, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { orderDataAtom } from '@/pages/SalesStats/atom'
import { useAtomValue } from 'jotai'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { getOrderStatus } from '@/utils'

const { RangePicker } = DatePicker

const Filter = () => {
  const orderData = useAtomValue(orderDataAtom)
  const orderStatuses = orderData?.info?.orderStatuses ?? []
  const options = orderStatuses.map((orderStatus) => {
    const { label } = getOrderStatus(orderStatus.value)
    return {
      label,
      value: orderStatus.value,
    }
  })
  console.log('⭐  Filter  orderStatuses', orderStatuses)

  const tagRender = (props: CustomTagProps) => {
    const { value, closable, onClose } = props
    const { label, color } = getOrderStatus(value)
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }

  return (
    <>
      <Row gutter={16} className="mb-8">
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">日期範圍</p>
          <RangePicker
            className="w-full"
            placeholder={[
              '開始日期',
              '結束日期',
            ]}
          />
        </Col>
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">選擇狀態</p>
          <Select
            mode="multiple"
            allowClear
            showArrow
            tagRender={tagRender}
            style={{ width: '100%' }}
            defaultValue={[
              'wc-processing',
              'wc-completed',
            ]}
            options={options}
          />
        </Col>
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">搜尋特定顧客 email</p>
          <Input placeholder="搜尋 email" />
        </Col>
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">&nbsp;</p>
          <Button className="w-full" type="primary" icon={<SearchOutlined />}>
            搜尋
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Filter
