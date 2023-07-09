import React from 'react'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

const DashBoard: React.FC = () => (
  <Row gutter={16} className="mb-8">
    <Col span={12}>
      <Card bordered={false} className="bg-gray-100/50">
        <Statistic
          title="今日"
          value={11.28}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
          suffix="%"
        />
      </Card>
    </Col>
    <Col span={12}>
      <Card bordered={false} className="bg-gray-100/50">
        <Statistic
          title="最近7日"
          value={9.3}
          precision={2}
          valueStyle={{ color: '#cf1322' }}
          prefix={<ArrowDownOutlined />}
          suffix="%"
        />
      </Card>
    </Col>
  </Row>
)

export default DashBoard
