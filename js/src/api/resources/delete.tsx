import { axios } from '@/api'
import { apiUrl } from '@/utils'

export const deleteResource = async ({
  resource,
  pathParams = [],
}: {
  resource: string
  pathParams: string[]
}) => {
  const deleteResult = await axios.delete(
    `${apiUrl}/wp/v2/${resource}/${pathParams.join('/')}/`,
  )

  return deleteResult
}
