import { getResource } from '@/api'
import { useQuery } from '@tanstack/react-query'
import { TPostArgs } from '@/types'

export const useOne = (options: {
  resource: string
  dataProvider?: 'wp' | 'wc'
  pathParams?: string[]
  args?: TPostArgs & {
    [key: string]: any
  }
  queryOptions?: {
    staleTime?: number
    cacheTime?: number
    refetchOnWindowFocus?: boolean
    refetchOnMount?: boolean
    refetchOnReconnect?: boolean
    refetchInterval?: number
    retry?: boolean | number
    retryDelay?: number
    enabled?: boolean
  }
}) => {
  const resource = options?.resource || 'post'
  const dataProvider = options?.dataProvider || 'wp'
  const pathParams = options?.pathParams || []
  const args = options?.args || undefined

  const queryKey = args
    ? [
        `get_${resource}`,
        dataProvider,
        pathParams,
        args,
      ]
    : [
        `get_${resource}`,
        dataProvider,
        pathParams,
      ]

  const getResult = useQuery(
    queryKey,
    async () =>
      getResource({
        resource,
        dataProvider,
        pathParams,
        args,
      }),
    options.queryOptions || {},
  )

  return getResult
}
