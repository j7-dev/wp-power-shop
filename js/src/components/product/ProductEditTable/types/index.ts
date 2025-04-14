
import { ZFormValues } from './schema'
import { z } from 'zod'


export type TFormValues = z.infer<typeof ZFormValues>;
export * from './schema'
