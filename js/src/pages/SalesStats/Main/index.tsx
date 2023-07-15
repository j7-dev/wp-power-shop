import { useEffect } from 'react'
import DashBoard from './DashBoard'
import Table from './Table'
import { postId } from '@/utils'
import { useAjaxGetOrders } from '@/pages/SalesStats/hooks/useAjaxGetOrders'
import { TOrderData, defaultOrderData } from '@/pages/SalesStats/types'
import {
  orderDataAtom,
  paginationAtom,
  filterAtom,
} from '@/pages/SalesStats/atom'
import { useSetAtom, useAtomValue } from 'jotai'

// import DownloadExcel from './DownloadExcel'

import Filter from './Filter'

const Main = () => {
  const pagination = useAtomValue(paginationAtom)
  const filter = useAtomValue(filterAtom)
  const mutation = useAjaxGetOrders<TOrderData>({
    ...pagination,
    ...filter,
    post_id: postId,
  })
  const isLoading = mutation?.isLoading ?? false
  const isError = mutation?.isError ?? false
  const isSuccess = mutation?.isSuccess ?? false
  const setOrderData = useSetAtom(orderDataAtom)

  useEffect(() => {
    if (!isLoading) {
      const orderData = mutation?.orderData ?? defaultOrderData
      setOrderData(orderData)
    }
  }, [isLoading])

  return (
    <div className="py-4">
      <DashBoard isLoading={isLoading} />
      <Filter isLoading={isLoading} />
      {/* <DownloadExcel
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
      /> */}
      <Table isLoading={isLoading} />
    </div>
  )
}

export default Main
