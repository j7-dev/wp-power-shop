import { Dayjs } from 'dayjs'

export type TOrderItem = {
  item_id: number
  name: string
  quantity: number
  total: string
  product_id: number
  line_total: string
  variation_id: number
}

export type TOrder = {
  items: TOrderItem[]
  total: string
  status: string
  shipping: string
  shipping_method: string
  order_id: number
  key: number
}

export type TOrderData = {
  list: TOrder[]
  info: {
    total: number
    maxNumPages: number
    sumTotal: number
    sumToday: number
    sumWeek: number
    orderStatuses: {
      value: string
    }[]
  }
}

export const defaultOrderData: TOrderData = {
  list: [],
  info: {
    total: 0,
    maxNumPages: 1,
    sumTotal: 0,
    sumToday: 0,
    sumWeek: 0,
    orderStatuses: [],
  },
}

export type TPagination = {
  paged: number
  limit: number
}

export const defaultPagination: TPagination = {
  paged: 1,
  limit: 10,
}

export type TFilter = {
  email?: string
  rangePicker?: Dayjs[]
  status?: string[]
}

export const defaultFilter: TFilter = {
  status: [
    'wc-processing',
    'wc-completed',
  ],
  email: '',
}
