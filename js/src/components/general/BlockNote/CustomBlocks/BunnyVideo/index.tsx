import { insertOrUpdateBlock, CustomBlockConfig } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { schema } from '../../useBlockNote'
import { FaPhotoVideo } from 'react-icons/fa'
import { useBunny } from 'antd-toolkit/refine'
import MediaLibraryButton, { TMediaLibraryButton } from './MediaLibraryButton'

export const bunnyVideoMenuItem = (editor: typeof schema.BlockNoteEditor) => ({
	key: 'bunnyVideo',
	title: 'Bunny Video', // 選單中文
	subtext: '可放置 Bunny 影片檔', // 說明文字
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			type: 'bunnyVideo',
		})
	},
	aliases: ['bunny'],
	group: 'Bunny',
	icon: <FaPhotoVideo className="w-[1.125rem] h-[1.125rem]" />,
})

const bunnyVideoBlockConfig: CustomBlockConfig = {
	type: 'bunnyVideo',
	propSchema: {
		vId: {
			default: '',
		},
	},
	content: 'none',
}

export const BunnyVideo = createReactBlockSpec(bunnyVideoBlockConfig, {
	render: (props) => {
		const { bunny_library_id = '' } = useBunny()
		const vId = props.block.props.vId
		const videoUrl = `https://iframe.mediadelivery.net/embed/${bunny_library_id}/${vId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`

		// ❗contentRef 有個屬性 name ，如果不能編輯是 ""，可以編輯是 "nodeViewContentRef"
		const editable = !(props.contentRef.name === '')

		if (!editable) {
			return (
				<iframe
					className="border-0 w-full aspect-video rounded-xl"
					src={videoUrl}
					loading="lazy"
					allow="encrypted-media;picture-in-picture;"
					allowFullScreen={true}
				></iframe>
			)
		}

		return <MediaLibraryButton {...(props as unknown as TMediaLibraryButton)} />
	},

	// ❗parse 是例如，將剪貼簿複製到編輯器時，要怎麼解析 HTML 轉換為 BLOCK
	parse: undefined,

	// ❗toExternalHTML 是例如，將區塊複製到剪貼簿到外部時，會複製的 內容，如果沒有定義就使用 render
	toExternalHTML: (props) => {
		const { bunny_library_id = '' } = useBunny()
		const vId = props.block.props.vId
		const videoUrl = `https://iframe.mediadelivery.net/embed/${bunny_library_id}/${vId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`
		return (
			<iframe
				className="border-0 absolute top-0 left-0 w-full h-full rounded-xl"
				src={videoUrl}
				loading="lazy"
				allow="encrypted-media;picture-in-picture;"
				allowFullScreen={true}
			></iframe>
		)
	},
})
