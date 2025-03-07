import { FC } from 'react'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import { BlockNoteViewProps } from '@blocknote/react'
import { DefaultStyleSchema, DefaultInlineContentSchema } from '@blocknote/core'
import '@blocknote/mantine/style.css'
import { schema } from './useBlockNote'
import './index.scss'

export * from './useBlockNote'

export const BlockNote: FC<
	BlockNoteViewProps<
		typeof schema.blockSchema,
		DefaultInlineContentSchema,
		DefaultStyleSchema
	>
> = (blockNoteViewProps) => {
	return <BlockNoteView {...blockNoteViewProps} />
}
