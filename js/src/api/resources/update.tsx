import { axios } from '@/api'
import { apiUrl } from '@/utils'

export const updateResource = async ({
  resource,
  pathParams = [],
  args = {},
}: {
  resource: string
  pathParams: string[]
  args: {
    [key: string]: any
  }
}) => {
  const updateResult = await axios.post(
    `${apiUrl}/wp/v2/${resource}/${new URLSearchParams(args).toString()}/`,
    args,
  )

  return updateResult
}
