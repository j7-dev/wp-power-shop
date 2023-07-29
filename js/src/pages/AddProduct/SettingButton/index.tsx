import { Button, Modal, DatePicker, Form, notification, ModalProps } from 'antd'
import { SettingFilled } from '@ant-design/icons'
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
    values.startTime = startTime ? dayjs(startTime).valueOf() : ''
    values.endTime = endTime ? dayjs(endTime).valueOf() : ''

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
          <div className="flex">
            <Form.Item name={['startTime']} label="開始" className="mr-8">
              <DatePicker
                showTime={{
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm"
                placeholder="選擇時間"
              />
            </Form.Item>
            <Form.Item name={['endTime']} label="結束">
              <DatePicker
                disabledDate={disabledDate}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder="選擇時間"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default SettingButton
