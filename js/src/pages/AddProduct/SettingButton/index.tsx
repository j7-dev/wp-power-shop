import { Button, Modal, DatePicker, Form, notification, ModalProps } from 'antd'
import { SettingFilled, SwapRightOutlined } from '@ant-design/icons'
import { useModal, useUpdate } from '@/hooks'
import type { RangePickerProps } from 'antd/es/date-picker'
import { kebab, postId, snake } from '@/utils'
import dayjs from 'dayjs'

const SettingButton = () => {
  const { showModal, modalProps, setIsModalOpen } = useModal()
  const [form] = Form.useForm()
  const watchStartTime = Form.useWatch(['startTime'], form)

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

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    if (!!watchStartTime) {
      return current < watchStartTime.endOf('day')
    }
    return false
  }

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

  return (
    <>
      <Button type="default" icon={<SettingFilled />} onClick={showModal}>
        設定
      </Button>
      <Modal {...settingModalProps}>
        <Form form={form} layout="vertical">
          <p>設定開站時間</p>
          <div
            className="flex my-8 rounded-md w-fit"
            style={{ border: '1px solid #999' }}
          >
            <Form.Item name={['startTime']} noStyle className="m-0">
              <DatePicker
                showTime={{
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm"
                placeholder="選擇時間"
                bordered={false}
              />
            </Form.Item>
            <SwapRightOutlined className="mx-4" />
            <Form.Item name={['endTime']} noStyle className="m-0">
              <DatePicker
                disabledDate={disabledDate}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder="選擇時間"
                bordered={false}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default SettingButton
