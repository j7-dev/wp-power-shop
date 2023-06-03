import { axios } from '@/api'
import { apiUrl, getDataProviderUrlParams } from '@/utils'

export const updateResource = async ({
  resource,
  dataProvider = 'wp',
  pathParams = [],
  args = {},
}: {
  resource: string
  dataProvider?: 'wp' | 'wc'
  pathParams?: string[]
  args?: {
    [key: string]: any
  }
}) => {
  const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
  const updateResult = await axios.post(
    `${apiUrl}/${dataProviderUrlParams}/${resource}/${pathParams.join(
      '/',
    )}?${new URLSearchParams(args).toString()}`,
    args,
  )

  return updateResult
}
