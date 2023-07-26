import { useEffect, useState } from 'react'
import { Popover, Tooltip, Button, Form, notification } from 'antd'
import { ExclamationCircleFilled, SaveFilled } from '@ant-design/icons'
import { isEqual as _isEqual, sortBy } from 'lodash-es'
import { useAtomValue } from 'jotai'
import { addedProductsAtom, FSMetaAtom } from './atoms'
import { TFSMeta } from '@/types'
import { useUpdate } from '@/hooks'
import { kebab, postId, snake } from '@/utils'

const SaveButton = () => {
  const form = Form.useFormInstance()
  const [
    api,
    contextHolder,
  ] = notification.useNotification()
  const [
    isEqual,
    setIsEqual,
  ] = useState(false)
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
    const allFields_obj = form.getFieldsValue()
    const allFields = Object.values(allFields_obj) as TFSMeta[]
    const sortOrder = addedProducts.map((product) => product.id)
    const sortedAllFields = sortBy(allFields, (field) => {
      return sortOrder.indexOf(field.productId)
    })

    mutate({
      meta: {
        [`${snake}_meta`]: JSON.stringify(sortedAllFields),
      },
    })
  }

  useEffect(() => {
    const allFields_obj = form.getFieldsValue()
    const allFields = Object.values(allFields_obj) as TFSMeta[]
    const checkIsEqual = _isEqual(FSMeta, allFields)
    console.log('⭐  useEffect  checkIsEqual', checkIsEqual, {
      allFields,
      FSMeta,
    })
    setIsEqual(checkIsEqual)
  }, [addedProducts.length])

  return (
    <>
      {contextHolder}
      <Popover
        placement="left"
        content={
          <span className="-mb-4">
            <ExclamationCircleFilled className="mr-2 text-red-500" />
            偵測到變更，記得儲存！
          </span>
        }
        open={!isEqual}
      >
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
      </Popover>
    </>
  )
}

export default SaveButton
