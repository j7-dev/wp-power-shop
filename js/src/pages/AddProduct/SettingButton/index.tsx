import { Button, Modal, Form, notification, ModalProps, Tabs, TabsProps } from 'antd'
import { SettingFilled } from '@ant-design/icons'
import { useModal, useUpdate, useAjaxGetPostMeta } from '@/hooks'
import { kebab, postId, snake } from '@/utils'
import dayjs from 'dayjs'
import { TSettings, defaultSettings } from '@/types'
import TimeSetting from './TimeSetting'
import OtherSettings from './OtherSettings'

const SettingButton = () => {
  const { showModal, modalProps, setIsModalOpen } = useModal()
  const [form] = Form.useForm()

  const { mutate, isLoading } = useUpdate({
    resource: kebab,
    dataProvider: 'wp',
    pathParams: [postId],
    mutationOptions: {
      onSuccess: () => {
        notification.success({
          message: '設定儲存成功，正刷新頁面...',
        })
        setIsModalOpen(false)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
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
    values.startTime = startTime ? dayjs(startTime).valueOf() : null
    values.endTime = endTime ? dayjs(endTime).valueOf() : null
    values.btnColor = values.btnColor?.toHexString()

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
    width: 960,
  }

  const result = useAjaxGetPostMeta<TSettings>({
    post_id: postId,
    meta_key: `${snake}_settings`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '{}'),
  })
  const { isLoading: isSettingLoading } = result
  const settings = result?.meta ?? defaultSettings

  const items: TabsProps['items'] = [
    {
      key: 'timeSetting',
      label: '開站時間',
      children: <TimeSetting isLoading={isSettingLoading} settings={settings} />,
    },
    {
      key: '2',
      label: '其他',
      children: <OtherSettings isLoading={isSettingLoading} settings={settings} />,
    },
  ]

  return (
    <>
      <Button type="default" icon={<SettingFilled />} onClick={showModal}>
        設定
      </Button>
      <Modal {...settingModalProps}>
        <Form form={form} layout="vertical">
          <Tabs tabPosition="left" items={items} className="h-[500px]" />
        </Form>
      </Modal>
    </>
  )
}

export default SettingButton
