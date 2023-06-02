import { getResource } from '@/api'
import { useQuery } from '@tanstack/react-query'

export const useOne = (options: {
  resource: string
  pathParams?: string[]
  args?: Record<string, string>
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
  const pathParams = options?.pathParams || []
  const args = options?.args || undefined

  const queryKey = args
    ? [
        `get_${resource}`,
        pathParams,
        args,
      ]
    : [
        `get_${resource}`,
        pathParams,
      ]

  const getResult = useQuery(
    queryKey,
    async () =>
      getResource({
        resource,
        pathParams,
        args,
      }),
    options.queryOptions || {},
  )

  return getResult
}
