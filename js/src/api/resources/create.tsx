import { axios } from '@/api'
import { apiUrl, getDataProviderUrlParams } from '@/utils'

export const createResource = async ({
  resource,
  dataProvider = 'wp',
  args,
  config,
}: {
  resource: string
  dataProvider?: 'wp' | 'wc'
  args?: {
    [key: string]: any
  }
  config?: any
}) => {
  const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
  const createResult = await axios.post(
    `${apiUrl}/${dataProviderUrlParams}/${resource}`,
    args,
    config,
  )

  return createResult
}
