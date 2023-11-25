import { DatePicker, Form, Alert } from 'antd'
import { SwapRightOutlined } from '@ant-design/icons'
import { useColor } from '@/hooks'
import { disabledDate, disabledTime } from '@/utils'
import dayjs, { Dayjs } from 'dayjs'
import { TSettings } from '@/types'
import { LoadingText } from '@/components/PureComponents'

const TimeSetting: React.FC<{
  isLoading: boolean
  settings: TSettings
}> = ({ isLoading, settings }) => {
  const form = Form.useFormInstance()
  const watchStartTime: Dayjs = Form.useWatch(['startTime'], form)
  const watchEndTime: Dayjs = Form.useWatch(['endTime'], form)
  const { colorBorder } = useColor()

  const initStartTime = settings?.startTime ? dayjs(settings?.startTime) : null
  const initEndTime = settings?.endTime ? dayjs(settings?.endTime) : null

  return (
    <>
      <p className="text-lg">設定開站時間</p>
      <Alert
        message="使用方法"
        description={
          <>
            <ol>
              <li>
                [開始時間] & [結束時間] <b> 可設定也可不設定</b>
              </li>
              <li>
                如果設定 [結束時間] & [結束時間]，則商店只有在
                <b> 期間內可以使用</b>
              </li>
              <li>
                若沒有設定 [結束時間]，則為<b> 永久開站</b>
              </li>
              <li>
                [開始時間] 可以不設定，如果設定時間點在未來，則為
                <b> 預約開站</b>
              </li>
            </ol>
          </>
        }
        type="info"
        showIcon
      />
      {isLoading ? (
        <LoadingText width="w-full" height="h-[2rem]" className="my-8" />
      ) : (
        <div className="flex justify-between my-8 rounded-md w-full" style={{ border: `1px solid ${colorBorder}` }}>
          <Form.Item name={['startTime']} noStyle className="m-0" initialValue={initStartTime}>
            <DatePicker
              disabledDate={disabledDate({
                type: 'startTime',
                watchStartTime,
                watchEndTime,
              })}
              disabledTime={disabledTime({
                type: 'startTime',
                watchStartTime,
                watchEndTime,
              })}
              showTime={{
                format: 'HH:mm',
                hideDisabledOptions: false,
              }}
              format="YYYY/MM/DD  HH:mm"
              placeholder="開始時間"
              bordered={false}
            />
          </Form.Item>
          <SwapRightOutlined className="mx-4" />
          <Form.Item name={['endTime']} noStyle className="m-0" initialValue={initEndTime}>
            <DatePicker
              disabledDate={disabledDate({
                type: 'endTime',
                watchStartTime,
                watchEndTime,
              })}
              disabledTime={disabledTime({
                type: 'endTime',
                watchStartTime,
                watchEndTime,
              })}
              showTime={{
                format: 'HH:mm',
                hideDisabledOptions: false,
              }}
              format="YYYY/MM/DD  HH:mm"
              placeholder="結束時間"
              bordered={false}
            />
          </Form.Item>
        </div>
      )}
    </>
  )
}

export default TimeSetting
