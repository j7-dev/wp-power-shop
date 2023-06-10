import { axios } from '@/api'
import { apiUrl, getDataProviderUrlParams } from '@/utils'
import { TDataProvider } from '@/types'

export const deleteResource = async ({
  resource,
  dataProvider = 'wp',
  pathParams = [],
}: {
  resource: string
  dataProvider?: TDataProvider
  pathParams?: string[]
}) => {
  const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
  const deleteResult = await axios.delete(
    `${apiUrl}/${dataProviderUrlParams}/${resource}/${pathParams.join('/')}`,
  )

  return deleteResult
}
