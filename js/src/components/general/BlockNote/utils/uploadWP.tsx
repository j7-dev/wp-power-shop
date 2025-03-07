import { TApiConfig } from '../types'

export type TUploadResponse = {
	code: string
	message: string
	data: TUploadData
}

export type TUploadData = {
	url: string
	type: string
	id: string | null
	name: string
	size: number
	width: number
	height: number
}

export const uploadWP =
	(apiConfig: TApiConfig) =>
	async (file: File): Promise<string> => {
		const { apiEndpoint, headers } = apiConfig
		const formData = new FormData()
		formData.append('files', file)
		formData.append('upload_only', '1')

		try {
			const call = await fetch(apiEndpoint, {
				method: 'POST',
				headers,
				body: formData,
			})
			const response: TUploadResponse = await call.json()

			return response?.data?.url
		} catch (error) {
			return Promise.reject(error)
		}
	}
