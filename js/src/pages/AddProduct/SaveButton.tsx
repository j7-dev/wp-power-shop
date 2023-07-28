import { Tooltip, Button, Form, notification } from 'antd'
import { SaveFilled } from '@ant-design/icons'
import { useSetAtom } from 'jotai'
import { isChangeAtom } from './atoms'
import { useUpdate } from '@/hooks'
import { kebab, postId, snake, formatShopMeta } from '@/utils'

const SaveButton = () => {
  const form = Form.useFormInstance()
  const [
    api,
    contextHolder,
  ] = notification.useNotification({
    maxCount: 1,
  })
  const setIsChange = useSetAtom(isChangeAtom)

  const { mutate, isLoading } = useUpdate({
    resource: kebab,
    dataProvider: 'wp',
    pathParams: [postId],
    mutationOptions: {
      onSuccess: () => {
        api.success({
          message: '儲存成功',
        })
        setIsChange(false)
        notification.destroy('saveNotification')
      },
      onError: (error) => {
        console.log('Error', error)
        api.error({
          message: '儲存失敗',
        })
      },
    },
  })

  const handleSave = () => {
    const allFields = formatShopMeta({ form })

    mutate({
      meta: {
        [`${snake}_meta`]: JSON.stringify(allFields),
      },
    })
  }

  return (
    <>
      {contextHolder}
      <Tooltip title="按此儲存按鈕才會儲存商品資料">
        <Button
          type="primary"
          className="px-8"
          icon={<SaveFilled />}
          onClick={handleSave}
          loading={isLoading}
        >
          儲存
        </Button>
      </Tooltip>
    </>
  )
}

export default SaveButton
