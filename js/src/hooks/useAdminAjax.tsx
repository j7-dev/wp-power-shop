/* eslint-disable @typescript-eslint/no-empty-function */
import { adminAjax, TAdminAjaxArgs } from '@/api'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'

export const useAdminAjax = (options: {
  args?: TAdminAjaxArgs
	config?: AxiosRequestConfig<{[key: string]: any;}> | undefined
  mutationOptions?: UseMutationOptions<unknown, unknown, TAdminAjaxArgs>
}) => {
  const args = options?.args || undefined
	const config = options?.config || undefined
  const mutationOptions = options.mutationOptions ?? {}
  const mutationFn = (fnProps?: TAdminAjaxArgs) =>
	adminAjax({
      args: fnProps ? fnProps : args,
			config,
    })
  const result = useMutation({
    mutationFn,
    ...mutationOptions,
  })

  return result
}
