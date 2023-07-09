import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { orderDataAtom } from '@/pages/SalesStats/atom'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'

const DashBoard: React.FC = () => {
  const orderData = useAtomValue(orderDataAtom)
  const info = orderData?.info
  const sumToday = info?.sumToday ?? 0
  const sumWeek = info?.sumWeek ?? 0
  const sumTotal = info?.sumTotal ?? 0

  return (
    <Row gutter={16} className="mb-8">
      <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
        <Card bordered={false} className="bg-gray-100/50">
          <Statistic
            title={
              <>
                今日 <sub>{dayjs().format('YYYY/MM/DD')}</sub>
              </>
            }
            value={sumToday}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
          />
        </Card>
      </Col>
      <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
        <Card bordered={false} className="bg-gray-100/50">
          <Statistic
            title={
              <>
                最近7日{' '}
                <sub>
                  {dayjs().subtract(7, 'day').format('YYYY/MM/DD')} -{' '}
                  {dayjs().format('YYYY/MM/DD')}
                </sub>
              </>
            }
            value={sumWeek}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
          />
        </Card>
      </Col>
      <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
        <Card bordered={false} className="bg-gray-100/50">
          <Statistic
            title="全部"
            value={sumTotal}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
          />
        </Card>
      </Col>
    </Row>
  )
}

export default DashBoard
