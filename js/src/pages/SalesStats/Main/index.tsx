import { useEffect } from 'react'
import DashBoard from './DashBoard'
import Table from './Table'
import { postId } from '@/utils'
import { useAjaxGetOrders } from '@/pages/SalesStats/hooks/useAjaxGetOrders'
import { TOrderData, defaultOrderData } from '@/pages/SalesStats/types'
import { orderDataAtom } from '@/pages/SalesStats/atom'
import { useSetAtom } from 'jotai'
import DownloadExcel from './DownloadExcel'
import Filter from './Filter'

const Main = () => {
  const mutation = useAjaxGetOrders<TOrderData>({
    post_id: postId,
  })
  const isLoading = mutation?.isLoading ?? false
  const setOrderData = useSetAtom(orderDataAtom)

  useEffect(() => {
    if (!isLoading) {
      const orderData = mutation?.orderData ?? defaultOrderData
      setOrderData(orderData)
    }
  }, [isLoading])

  return (
    <div className="py-4">
      <DashBoard />
      <Filter />
      <DownloadExcel />
      <Table />
    </div>
  )
}

export default Main
