import { FormInstance, notification } from 'antd'
import { useSetAtom } from 'jotai'
import { isChangeAtom } from '../atoms'
import { useUpdate } from '@/hooks'
import { kebab, postId, snake, formatShopMeta } from '@/utils'

const useSave = (form: FormInstance) => {
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

  return {
    handleSave,
    isLoading,
  }
}

export default useSave
