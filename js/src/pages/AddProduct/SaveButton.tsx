import { Tooltip, Button, Form, notification, ButtonProps } from 'antd'
import { useSetAtom } from 'jotai'
import { isChangeAtom } from './atoms'
import { useUpdate } from '@/hooks'
import { kebab, postId, snake, formatShopMeta } from '@/utils'

const SaveButton: React.FC<ButtonProps> = (props) => {
  const form = Form.useFormInstance()
  const setIsChange = useSetAtom(isChangeAtom)

  const { mutate, isLoading } = useUpdate({
    resource: kebab,
    dataProvider: 'wp',
    pathParams: [postId],
    mutationOptions: {
      onSuccess: () => {
        notification.success({
          message: '儲存成功',
        })
        setIsChange(false)
        notification.destroy('saveNotification')
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
    const allFields = formatShopMeta({ form })

    mutate({
      meta: {
        [`${snake}_meta`]: JSON.stringify(allFields),
      },
    })
  }

  return (
    <>
      <Tooltip title="按此儲存按鈕才會儲存商品資料">
        <Button {...props} onClick={handleSave} loading={isLoading}>
          儲存
        </Button>
      </Tooltip>
    </>
  )
}

export default SaveButton
