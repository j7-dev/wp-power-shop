import {
	TOptionsUpload,
	OptionsUploadSchema,
	DEFAULT_OPTIONS_UPLOAD,
} from '@/types/options'
import { useCustom, useApiUrl } from '@refinedev/core'
import { safeParse } from '@/utils'

/**
 * 取得  Options Upload 的設定
 * @returns TOptionsUpload
 */
export const useOptionsUpload = (): TOptionsUpload => {
	const apiUrl = useApiUrl()
	const { data, isLoading } = useCustom({
		url: `${apiUrl}/options/upload`,
		method: 'get',
	})

	const optionsUploadData =
		data?.data?.data || (DEFAULT_OPTIONS_UPLOAD as TOptionsUpload)

	if (!isLoading) {
		safeParse(OptionsUploadSchema, optionsUploadData)
	}

	return optionsUploadData
}
