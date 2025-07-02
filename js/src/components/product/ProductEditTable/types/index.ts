
import { ZFormValues } from './schema'
import * as z from 'zod/v4'


export type TFormValues = z.infer<typeof ZFormValues>;
export * from './schema'
