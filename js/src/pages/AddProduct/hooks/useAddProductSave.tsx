import { useEffect } from 'react'
import useSave from '../SaveButton/useSave'
import { notification, FormInstance } from 'antd'
import { fieldNode, tinyMCESaveBtn, blockEditorSaveBtn } from '../index'
import { TPSMeta } from '@/types'
import { TProduct } from '@/types/wcRestApi'
import { sortBy } from 'lodash-es'
import { useSetAtom } from 'jotai'
import { addedProductsAtom, PSMetaAtom } from '../atoms'
import { TResult } from './useGetAddProducts'

type TUseAddProductSaveProps = {
  form: FormInstance
  isPSMetaLoading: boolean
  productsResult: TResult<TProduct>
  shop_meta: TPSMeta[]
}

const useAddProductSave = ({ form, isPSMetaLoading, productsResult, shop_meta }: TUseAddProductSaveProps) => {
  const { handleSave: save } = useSave(form)

  const setAddedProducts = useSetAtom(addedProductsAtom)
  const setPSMeta = useSetAtom(PSMetaAtom)

  const handleSave = async (e: Event) => {
    notification.destroy('saveNotification')
    if (!fieldNode) {
      await save()
    }
  }

  useEffect(() => {
    if (!!blockEditorSaveBtn) {
      blockEditorSaveBtn.addEventListener('click', handleSave)
    }
    return () => {
      if (!!blockEditorSaveBtn) {
        blockEditorSaveBtn.removeEventListener('click', handleSave)
      }
    }
  }, [])

  useEffect(() => {
    if (!productsResult?.isFetching && !isPSMetaLoading) {
      const products = (productsResult?.data?.data || []) as TProduct[]

      // 排序

      const sortOrder = shop_meta.map((m) => m.productId)
      const sortedProducts = sortBy(products, (p) => {
        return sortOrder.indexOf(p.id)
      })

      const isUndefined = sortOrder.every((o) => o === undefined)

      if (isUndefined) {
        setAddedProducts([])
        setPSMeta([])
      } else {
        setAddedProducts(sortedProducts)
        setPSMeta(shop_meta)
      }

      // 載入完成後，啟用儲存按鈕

      if (tinyMCESaveBtn) tinyMCESaveBtn.disabled = false
      if (blockEditorSaveBtn) blockEditorSaveBtn.disabled = false
    } else {
      // 載入完成前，禁用儲存按鈕

      if (tinyMCESaveBtn) tinyMCESaveBtn.disabled = true
      if (blockEditorSaveBtn) blockEditorSaveBtn.disabled = true
    }
  }, [
    isPSMetaLoading,
    productsResult?.isFetching,
    shop_meta,
  ])

  return { handleSave }
}

export default useAddProductSave
