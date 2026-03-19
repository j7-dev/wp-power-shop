import * as z from 'zod/v4'

import { ZFormValues } from './schema'

export type TFormValues = z.infer<typeof ZFormValues>
export * from './schema'
