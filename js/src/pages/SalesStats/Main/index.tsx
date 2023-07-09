import React from 'react'
import DashBoard from './DashBoard'
import Table from './Table'
import { postId } from '@/utils'
import { useAjaxGetOrders } from '@/pages/SalesStats/hooks/useAjaxGetOrders'
import { TOrder } from '@/pages/SalesStats/types'

const Main = () => {
  const mutation = useAjaxGetOrders<any>({
    post_id: postId,
  })
  const orders = (mutation?.orderData?.list ?? []) as TOrder[]

  return (
    <div className="py-4">
      <DashBoard />
      <Table />;
    </div>
  )
}

export default Main
