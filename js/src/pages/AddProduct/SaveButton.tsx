import { useEffect, useState } from 'react'
import { Tooltip, Button, Form, notification } from 'antd'
import { SaveFilled } from '@ant-design/icons'
import { isEqual as _isEqual } from 'lodash-es'
import { useAtomValue } from 'jotai'
import { addedProductsAtom, FSMetaAtom } from './atoms'
import { TFSMeta } from '@/types'
import { useUpdate } from '@/hooks'
import { kebab, postId, snake, formatShopMeta } from '@/utils'

let countRender = 1

const SaveButton = () => {
  const form = Form.useFormInstance()
  const [
    api,
    contextHolder,
  ] = notification.useNotification({
    maxCount: 1,
  })
  const [
    isEqual,
    setIsEqual,
  ] = useState(true)
  const addedProducts = useAtomValue(addedProductsAtom)
  const FSMeta = useAtomValue(FSMetaAtom)

  const { mutate, isLoading } = useUpdate({
    resource: kebab,
    dataProvider: 'wp',
    pathParams: [postId],
    mutationOptions: {
      onSuccess: () => {
        api.success({
          message: '儲存成功',
        })
        setIsEqual(true)
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

  useEffect(() => {
    if (countRender > 2) {
      const allFields_obj = form.getFieldsValue()
      const allFields = Object.values(allFields_obj) as TFSMeta[]
      const checkIsEqual = _isEqual(FSMeta, allFields)
      setIsEqual(checkIsEqual)
    }
    countRender++
  }, [addedProducts.length])

  useEffect(() => {
    if (!isEqual) {
      notification.config({
        maxCount: 1,
      })
      notification.warning({
        key: 'saveNotification',
        message: '偵測到變更，記得儲存！',
        duration: null,
        placement: 'bottomRight',
      })
    }
  }, [isEqual])

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
