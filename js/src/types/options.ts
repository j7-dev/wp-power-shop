import { z } from 'zod'

// Zod Schema
export const OptionsUploadSchema = z.object({
	allowed_mime_types: z.string(),
})

export type TOptionsUpload = z.infer<typeof OptionsUploadSchema>

export const DEFAULT_OPTIONS_UPLOAD: TOptionsUpload = {
	allowed_mime_types: '',
}