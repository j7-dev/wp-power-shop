import { axios } from '@/api'
import { apiUrl, getDataProviderUrlParams } from '@/utils'

export const deleteResource = async ({
  resource,
  dataProvider = 'wp',
  pathParams = [],
}: {
  resource: string
  dataProvider?: 'wp' | 'wc'
  pathParams?: string[]
}) => {
  const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
  const deleteResult = await axios.delete(
    `${apiUrl}/${dataProviderUrlParams}/${resource}/${pathParams.join('/')}`,
  )

  return deleteResult
}
