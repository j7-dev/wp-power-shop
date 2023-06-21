import { axios } from '@/api'
import { ajaxUrl } from '@/utils'
import { AxiosRequestConfig } from 'axios'

export type TAdminAjaxArgs = {
	action: string
	nonce: string
	[key: string]: any
}

export const adminAjax = async ({
  args,
	config = undefined,
}: {
  args?: TAdminAjaxArgs
	config?: AxiosRequestConfig<{[key: string]: any;}> | undefined
}) => {

  const result = await axios.post(
    ajaxUrl,
    args,
		config
  )

  return result
}
