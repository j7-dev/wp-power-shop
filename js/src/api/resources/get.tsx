import { axios } from '@/api'
import { apiUrl, getDataProviderUrlParams } from '@/utils'

export const getResource = async ({
  resource,
  dataProvider = 'wp',
  pathParams = [],
  args = {},
}: {
  resource: string
  dataProvider?: 'wp' | 'wc'
  pathParams?: string[]
  args?: Record<string, string>
}) => {
  const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
  const getResult = await axios.get(
    `${apiUrl}/${dataProviderUrlParams}/${resource}/${pathParams.join(
      '/',
    )}?${new URLSearchParams(args).toString()}`,
  )

  return getResult
}

export const getResources = async ({
  resource,
  dataProvider = 'wp',
  pathParams = [],
  args = {},
}: {
  resource: string
  dataProvider?: 'wp' | 'wc'
  pathParams?: string[]
  args?: Record<string, string>
}) => {
  const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
  const getResult = await axios.get(
    `${apiUrl}/${dataProviderUrlParams}/${resource}/${pathParams.join(
      '/',
    )}?${new URLSearchParams(args).toString()}`,
  )

  return getResult
}
