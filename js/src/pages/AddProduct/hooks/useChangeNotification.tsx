import { useEffect } from 'react'
import { formatShopMeta } from '@/utils'
import { addedProductsAtom, isChangeAtom } from '../atoms'
import { useAtom } from 'jotai'
import { notification, FormInstance } from 'antd'
import { fieldNode } from '../index'

const useChangeNotification = (form: FormInstance) => {
  const [
    isChange,
    setIsChange,
  ] = useAtom(isChangeAtom)

  const [
    addedProducts,
  ] = useAtom(addedProductsAtom)

  const handleSetCustomFieldValue = async () => {
    // Form 改變時，寫入自訂欄位

    if (fieldNode) {
      const sortedAllFields = await formatShopMeta({
        form,
      })
      fieldNode.value = JSON.stringify(sortedAllFields)
    }
  }

  useEffect(() => {
    if (isChange) {
      notification.config({
        maxCount: 1,
      })
      notification.warning({
        key: 'saveNotification',
        message: '偵測到變更，記得儲存！',
        duration: null,
        placement: 'bottomRight',
      })
    } else {
      notification.destroy('saveNotification')
    }
  }, [isChange])

  useEffect(() => {
    handleSetCustomFieldValue()
  }, [addedProducts.length])

  const handleFormChange = () => {
    setIsChange(true)
    handleSetCustomFieldValue()
  }

  return { handleFormChange }
}

export default useChangeNotification
