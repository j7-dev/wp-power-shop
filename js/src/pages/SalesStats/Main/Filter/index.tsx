import { DatePicker, Select, SelectProps, Input, Button, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { orderDataAtom } from '@/pages/SalesStats/atom'
import { useAtomValue } from 'jotai'

const { RangePicker } = DatePicker

const Filter = () => {
  const orderData = useAtomValue(orderDataAtom)
  const orderStatuses = orderData?.info?.orderStatuses ?? []
  console.log('⭐  Filter  orderStatuses', orderStatuses)

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
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={[
              'wc-processing',
              'wc-completed',
            ]}
            options={orderStatuses}
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
