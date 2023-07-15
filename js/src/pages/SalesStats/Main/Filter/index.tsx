import { DatePicker, Select, Input, Button, Row, Col, Tag, Form } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { orderDataAtom, filterAtom } from '@/pages/SalesStats/atom'
import { useAtomValue, useAtom } from 'jotai'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { getOrderStatus } from '@/utils'

const { RangePicker } = DatePicker

const Filter: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [form] = Form.useForm()
  const orderData = useAtomValue(orderDataAtom)
  const [
    filter,
    setFilter,
  ] = useAtom(filterAtom)
  const orderStatuses = orderData?.info?.orderStatuses ?? []
  const options = orderStatuses.map((orderStatus) => {
    const { label } = getOrderStatus(orderStatus.value)
    return {
      label,
      value: orderStatus.value,
    }
  })

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

  const handleFilter = () => {
    const values = form.getFieldsValue()
    setFilter(values)
  }

  return (
    <Form form={form}>
      <Row gutter={16} className="mb-8">
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">日期範圍</p>
          <Form.Item
            name={[
              'rangePicker',
            ]}
            noStyle
          >
            <RangePicker
              className="w-full"
              placeholder={[
                '開始日期',
                '結束日期',
              ]}
              disabled={isLoading}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">選擇狀態</p>
          <Form.Item name={['status']} noStyle initialValue={filter.status}>
            <Select
              mode="multiple"
              allowClear
              showArrow
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={options}
              loading={isLoading}
            />
          </Form.Item>
        </Col>
        <Form.Item name={['email']} noStyle initialValue={filter.email}>
          <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
            <p className="my-0">搜尋特定顧客 ID 或 E-mail</p>
            <Input placeholder="搜尋 E-mail" disabled={isLoading} allowClear />
          </Col>
        </Form.Item>
        <Form.Item name={['is_download']} hidden initialValue={0} />
        <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
          <p className="my-0">&nbsp;</p>
          <Button
            htmlType="submit"
            className="w-full"
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleFilter}
            loading={isLoading}
          >
            搜尋
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default Filter
