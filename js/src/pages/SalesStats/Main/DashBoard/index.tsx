import React from 'react'
import { Card, Col, Row, Statistic, Tooltip } from 'antd'
import { orderDataAtom } from '@/pages/SalesStats/atom'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { ExclamationCircleFilled } from '@ant-design/icons'

const DashBoard: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
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
              <div className="flex items-center">
                今日
                <sub className="mx-2 self-end">
                  {dayjs().format('YYYY/MM/DD')}
                </sub>
                <Tooltip title="此數據依照 日期以外 的篩選條件變動">
                  <ExclamationCircleFilled className="text-yellow-500" />
                </Tooltip>
              </div>
            }
            value={sumToday.sum}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
            loading={isLoading}
          />
          <p className="m-0 text-gray-500">一共 {sumToday.order_qty} 筆訂單</p>
        </Card>
      </Col>
      <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
        <Card bordered={false} className="bg-gray-100/50">
          <Statistic
            title={
              <div className="flex items-center">
                最近7日
                <sub className="mx-2 self-end">
                  {dayjs().subtract(7, 'day').format('YYYY/MM/DD')} -{' '}
                  {dayjs().format('YYYY/MM/DD')}
                </sub>
                <Tooltip title="此數據依照 日期以外 的篩選條件變動">
                  <ExclamationCircleFilled className="text-yellow-500" />
                </Tooltip>
              </div>
            }
            value={sumWeek.sum}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
            loading={isLoading}
          />
          <p className="m-0 text-gray-500">一共 {sumWeek.order_qty} 筆訂單</p>
        </Card>
      </Col>
      <Col span={24} md={{ span: 12 }} xxl={{ span: 8 }} className="mb-4">
        <Card bordered={false} className="bg-gray-100/50">
          <Statistic
            title={
              <div className="flex items-center">
                全部
                <Tooltip title="此數據依照篩選條件變動">
                  <ExclamationCircleFilled className="text-yellow-500 ml-2" />
                </Tooltip>
              </div>
            }
            value={sumTotal.sum}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
            loading={isLoading}
          />
          <p className="m-0 text-gray-500">一共 {sumTotal.order_qty} 筆訂單</p>
        </Card>
      </Col>
    </Row>
  )
}

export default DashBoard
