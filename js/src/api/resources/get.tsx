import { axios } from '@/api'
import { apiUrl } from '@/utils'

export const getResource = async ({
  resource,
  pathParams = [],
  args = {},
}: {
  resource: string
  pathParams: string[]
  args?: Record<string, string>
}) => {
  const getResult = await axios.get(
    `${apiUrl}/wp/v2/${resource}/${pathParams.join('/')}/?${new URLSearchParams(
      args,
    ).toString()}`,
  )

  return getResult
}

export const getResources = async ({
  resource,
  pathParams = [],
  args = {},
}: {
  resource: string
  pathParams: string[]
  args?: Record<string, string>
}) => {
  const getResult = await axios.get(
    `${apiUrl}/wp/v2/${resource}/${pathParams.join('/')}/?${new URLSearchParams(
      args,
    ).toString()}`,
  )

  return getResult
}
