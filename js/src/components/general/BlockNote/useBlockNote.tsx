import { useState } from 'react'
import { TUseBlockNoteParams } from './types'
import {
	useCreateBlockNote,
	BlockNoteViewProps,
	SuggestionMenuController,
	getDefaultReactSlashMenuItems,
	BasicTextStyleButton,
	BlockTypeSelect,
	ColorStyleButton,
	CreateLinkButton,
	FileCaptionButton,
	FileReplaceButton,
	FormattingToolbar,
	FormattingToolbarController,
	NestBlockButton,
	TextAlignButton,
	UnnestBlockButton,
	DefaultReactSuggestionItem,
} from '@blocknote/react'
import {
	DefaultStyleSchema,
	DefaultInlineContentSchema,
	Block,
	BlockNoteSchema,
	defaultBlockSpecs,
	filterSuggestionItems,
} from '@blocknote/core'
import {
	Alert,
	alertMenuItem,
	CustomHTML,
	customHTMLMenuItem,
	BunnyVideo,
	bunnyVideoMenuItem,
	BunnyAudio,
	bunnyAudioMenuItem,
} from './CustomBlocks'
import {
	uploadWP,
	getFileExtension,
	getIconHTML,
	convertDivToATag,
} from './utils'

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
export const schema = BlockNoteSchema.create({
	blockSpecs: {
		...defaultBlockSpecs, // Adds all default blocks.
		alert: Alert,
		customHTML: CustomHTML,
		bunnyVideo: BunnyVideo,
		bunnyAudio: BunnyAudio,
		numberedListItem: undefined as any,
		checkListItem: undefined as any,
		video: undefined as any,
		audio: undefined as any,
	},
})

export const useBlockNote = (params: TUseBlockNoteParams) => {
	const {
		options,
		deps = [],
		apiConfig,

		// itemsFilter = (items: DefaultReactSuggestionItem[], _query: string) =>
		//   items,
	} = params || {}

	/** @see https://www.blocknotejs.org/docs/editor-basics/setup */
	const editor = useCreateBlockNote(
		{
			schema,
			uploadFile: uploadWP(apiConfig),
			...options,
		},
		deps,
	)

	const [blocks, setBlocks] = useState<Block[]>([])
	const [html, setHTML] = useState<string>('')

	const blockNoteViewProps: BlockNoteViewProps<
		typeof schema.blockSchema,
		DefaultInlineContentSchema,
		DefaultStyleSchema
	> = {
		editor,
		onChange: async () => {
			// Saves the document JSON to state.
			setBlocks(editor.document as Block[])

			// 如果沒有內容就 setHTML 為空字串
			if (editor.document.length === 1) {
				if (
					'paragraph' === editor.document[0].type &&
					!(editor.document[0]?.content as Array<any>)?.length
				) {
					setHTML('')
					return
				}
			}

			// 另一種輸出方式 const newHtml = await editor.blocksToHTMLLossy(editor.document)
			const newHtml = await editor.blocksToFullHTML(editor.document)
			const parser = new DOMParser()
			const doc = parser.parseFromString(newHtml, 'text/html')

			// 將圖片的 data-url 轉換成 src
			doc.body
				.querySelectorAll('[data-content-type="image"]')
				.forEach((node) => {
					const src = node.getAttribute('data-url')
					const imageNode = node.querySelector('img')
					if (imageNode) {
						imageNode.setAttribute('src', src || '')
					}
				})

			// 將檔案的 data-url 轉換成 下載連結
			doc.body
				.querySelectorAll('[data-content-type="file"]')
				.forEach((node) => {
					const link = node.getAttribute('data-url')
					const previewNode = node.querySelector(
						'.bn-file-default-preview',
					) as HTMLDivElement

					if (previewNode) {
						const previewANode = convertDivToATag(previewNode)
						previewANode.setAttribute('href', link || '')
						previewANode.setAttribute('target', '_blank')

						const iconNode = previewANode.querySelector(
							'.bn-file-default-preview-icon',
						)

						if (iconNode) {
							const ext = getFileExtension(link || '')
							iconNode.innerHTML = getIconHTML(ext)
						}
					}
				})

			// 將音檔的 data-url 轉換成 下載連結
			doc.body
				.querySelectorAll('[data-content-type="audio"]')
				.forEach((node) => {
					const src = node.getAttribute('data-url')
					const audioNode = node.querySelector('.bn-audio')

					if (audioNode) {
						audioNode.setAttribute('src', src || '')
					}
				})

			setHTML(doc.body.innerHTML)
		},
		theme: 'light',
		formattingToolbar: false, // 自訂 toolbar
		linkToolbar: true,
		sideMenu: true,
		slashMenu: false, // 自訂選單
		emojiPicker: false, // 關閉 Emoji
		filePanel: true,
		tableHandles: true,
		children: (
			<>
				<SuggestionMenuController
					triggerCharacter={'/'}
					getItems={async (query) => {
						const menuItems = getDefaultReactSlashMenuItems(editor).filter(
							(menuItem) =>
								(menuItem as DefaultReactSuggestionItem & { key: string })
									?.key !== 'emoji', // 隱藏 Emoji
						)

						const menuItemsAfterAlertInserted = insertAfter(
							menuItems,
							alertMenuItem(editor),
							'Others',
						)
						const menuItemsAfterCustomHTMLInserted = insertAfter(
							menuItemsAfterAlertInserted,
							customHTMLMenuItem(editor),
							'Advanced',
						)

						const menuItemsAfterBunnyVideoInserted = insertAfter(
							menuItemsAfterCustomHTMLInserted,
							bunnyVideoMenuItem(editor),
							'Bunny',
						)

						const menuItemsAfterBunnyAudioInserted = insertAfter(
							menuItemsAfterBunnyVideoInserted,
							bunnyAudioMenuItem(editor),
							'Bunny',
						)

						return filterSuggestionItems(
							// eslint-disable-next-line lines-around-comment
							// Gets all default slash menu items and `insertAlert` item.
							menuItemsAfterBunnyAudioInserted,
							query,
						)
					}}
				/>
				<FormattingToolbarController
					formattingToolbar={() => (
						<FormattingToolbar>
							<BlockTypeSelect key={'blockTypeSelect'} />

							<FileCaptionButton key={'fileCaptionButton'} />
							<FileReplaceButton key={'replaceFileButton'} />

							<BasicTextStyleButton
								basicTextStyle={'bold'}
								key={'boldStyleButton'}
							/>
							<BasicTextStyleButton
								basicTextStyle={'italic'}
								key={'italicStyleButton'}
							/>
							<BasicTextStyleButton
								basicTextStyle={'underline'}
								key={'underlineStyleButton'}
							/>
							<BasicTextStyleButton
								basicTextStyle={'strike'}
								key={'strikeStyleButton'}
							/>
							{/* Extra button to toggle code styles */}
							<BasicTextStyleButton
								key={'codeStyleButton'}
								basicTextStyle={'code'}
							/>

							<TextAlignButton
								textAlignment={'left'}
								key={'textAlignLeftButton'}
							/>
							<TextAlignButton
								textAlignment={'center'}
								key={'textAlignCenterButton'}
							/>
							<TextAlignButton
								textAlignment={'right'}
								key={'textAlignRightButton'}
							/>

							<ColorStyleButton key={'colorStyleButton'} />

							<NestBlockButton key={'nestBlockButton'} />
							<UnnestBlockButton key={'unnestBlockButton'} />

							<CreateLinkButton key={'createLinkButton'} />
						</FormattingToolbar>
					)}
				/>
			</>
		),
	}

	return {
		blockNoteViewProps,
		blocks,
		setBlocks,
		html,
		setHTML,
	}
}

/**
 * 將新物件插入到陣列中指定 group 的物件之後
 *
 * @param {DefaultReactSuggestionItem[]} arr
 * @param {DefaultReactSuggestionItem}   newObj
 * @param {string}                       group
 * @return {{}}
 */
function insertAfter(
	arr: DefaultReactSuggestionItem[],
	newObj: DefaultReactSuggestionItem,
	group: string,
) {
	// 從後往前找到最後一個 group 為 'advanced' 的物件
	const lastAdvancedIndex = arr
		.slice()
		.reverse()
		.findIndex((obj) => obj.group === group)

	// 如果找不到，則將新物件插入到陣列的最後面
	const insertIndex =
		lastAdvancedIndex === -1 ? arr.length : arr.length - lastAdvancedIndex

	// 創建新陣列並插入新物件
	const newArr = [
		...arr.slice(0, insertIndex),
		newObj,
		...arr.slice(insertIndex),
	]

	return newArr
}
