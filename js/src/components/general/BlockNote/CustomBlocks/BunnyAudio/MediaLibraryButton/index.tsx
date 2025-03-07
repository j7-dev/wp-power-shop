import { useEffect, memo } from 'react'
import { Button } from 'antd'
import { useAtom } from 'jotai'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import {
	CustomBlockConfig,
	DefaultInlineContentSchema,
	DefaultStyleSchema,
} from '@blocknote/core'
import { useBunny, mediaLibraryAtom } from 'antd-toolkit/refine'

export type TMediaLibraryButton = ReactCustomBlockRenderProps<
	CustomBlockConfig,
	DefaultInlineContentSchema,
	DefaultStyleSchema
>

const MediaLibraryButton = (props: TMediaLibraryButton) => {
	const [mediaLibrary, setMediaLibrary] = useAtom(mediaLibraryAtom)

	const confirmedSelectedVId = mediaLibrary.confirmedSelectedVideos?.[0]?.guid
	const key = mediaLibrary.key
	const blockId = props.editor.getBlock(props.block)?.id || ''

	const vId = props.editor.getBlock(props.block)?.props?.vId

	useEffect(() => {
		const timer = setTimeout(() => {
			if (confirmedSelectedVId && key === blockId) {
				props.editor.updateBlock(props.block, {
					type: 'bunnyAudio',
					props: { vId: confirmedSelectedVId as any },
				})
			}
		}, 300)

		return () => clearTimeout(timer)
	}, [confirmedSelectedVId, blockId, key])

	const handleOpenMediaLibrary = () => {
		setMediaLibrary((prev) => ({
			...prev,
			modalProps: {
				...prev.modalProps,
				open: true,
			},
			mediaLibraryProps: {
				...prev.mediaLibraryProps,
				selectedVideos: [],
			},
			name: undefined,
			form: undefined,
			confirmedSelectedVideos: [],
			key: blockId,
		}))
	}
	const { bunny_cdn_hostname = '' } = useBunny()
	const audioUrl = `https://${bunny_cdn_hostname}/${vId}/playlist.m3u8`

	return (
		<div
			className={'bn-file-block-content-wrapper w-full'}
			data-editable="1"
			ref={props.contentRef}
		>
			{!vId && (
				<Button
					size="small"
					type="primary"
					className=""
					onClick={handleOpenMediaLibrary}
				>
					開啟 Bunny 媒體庫
				</Button>
			)}
			{!!vId && <audio id="audioPlayer" data-src={audioUrl} controls></audio>}
		</div>
	)
}

export default memo(MediaLibraryButton)
