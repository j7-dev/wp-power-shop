import {
  Button,
  Modal,
  DatePicker,
  Form,
  notification,
  ModalProps,
  Alert,
} from 'antd'
import { SettingFilled, SwapRightOutlined } from '@ant-design/icons'
import { useModal, useUpdate, useColor, useAjaxGetPostMeta } from '@/hooks'
import { kebab, postId, snake, disabledDate, disabledTime } from '@/utils'
import dayjs, { Dayjs } from 'dayjs'
import { TSettings, defaultSettings } from '@/types'
import { LoadingText } from '@/components/PureComponents'

const SettingButton = () => {
  const { showModal, modalProps, setIsModalOpen } = useModal()
  const [form] = Form.useForm()
  const watchStartTime: Dayjs = Form.useWatch(['startTime'], form)
  const watchEndTime: Dayjs = Form.useWatch(['endTime'], form)
  const { colorBorder } = useColor()

  const { mutate, isLoading } = useUpdate({
    resource: kebab,
    dataProvider: 'wp',
    pathParams: [postId],
    mutationOptions: {
      onSuccess: () => {
        notification.success({
          message: '儲存成功',
        })
        setIsModalOpen(false)
      },
      onError: (error) => {
        console.log('Error', error)
        notification.error({
          message: '儲存失敗',
        })
      },
    },
  })

  const handleSave = () => {
    const values = form.getFieldsValue()
    const { startTime, endTime } = values
    values.startTime = startTime ? dayjs(startTime).valueOf() : 0
    values.endTime = endTime ? dayjs(endTime).valueOf() : 0

    mutate({
      meta: {
        [`${snake}_settings`]: JSON.stringify(values),
      },
    })
  }

  const settingModalProps: ModalProps = {
    ...modalProps,
    okText: '儲存',
    cancelText: '取消',
    onOk: handleSave,
    confirmLoading: isLoading,
  }

  const mutation = useAjaxGetPostMeta<TSettings>({
    post_id: postId,
    meta_key: `${snake}_settings`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '{}'),
  })
  const { isLoading: getIsLoading } = mutation
  const settings = mutation?.meta ?? defaultSettings
  const initStartTime = settings?.startTime ? dayjs(settings?.startTime) : null
  const initEndTime = settings?.endTime ? dayjs(settings?.endTime) : null

  return (
    <>
      <Button type="default" icon={<SettingFilled />} onClick={showModal}>
        設定
      </Button>
      <Modal {...settingModalProps}>
        <Form form={form} layout="vertical">
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
          {getIsLoading ? (
            <LoadingText width="w-full" height="h-[2rem]" className="my-8" />
          ) : (
            <div
              className="flex justify-between my-8 rounded-md w-full"
              style={{ border: `1px solid ${colorBorder}` }}
            >
              <Form.Item
                name={['startTime']}
                noStyle
                className="m-0"
                initialValue={initStartTime}
              >
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
              <Form.Item
                name={['endTime']}
                noStyle
                className="m-0"
                initialValue={initEndTime}
              >
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
        </Form>
      </Modal>
    </>
  )
}

export default SettingButton
