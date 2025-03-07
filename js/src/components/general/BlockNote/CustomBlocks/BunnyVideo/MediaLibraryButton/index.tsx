import { useEffect, memo } from 'react'
import { Button } from 'antd'
import { useAtom } from 'jotai'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import {
	CustomBlockConfig,
	DefaultInlineContentSchema,
	DefaultStyleSchema,
} from '@blocknote/core'
import { TbSwitchHorizontal } from 'react-icons/tb'
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
					type: 'bunnyVideo',
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
	const { bunny_library_id = '' } = useBunny()
	const videoUrl = `https://iframe.mediadelivery.net/embed/${bunny_library_id}/${vId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`

	const handleSwitch = () => {
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
			{!!vId && (
				<div className="relative aspect-video rounded-lg border border-dashed border-gray-300">
					<div className="absolute w-full h-full top-0 left-0 p-2">
						<div className="w-full h-full rounded-xl overflow-hidden">
							<div
								className="rounded-xl bg-gray-200 tw-block"
								style={{
									position: 'relative',
									paddingTop: '56.25%',
								}}
							>
								<iframe
									className="border-0 absolute top-0 left-0 w-full h-full rounded-xl"
									src={videoUrl}
									loading="lazy"
									allow="encrypted-media;picture-in-picture;"
									allowFullScreen={true}
								></iframe>

								<div
									onClick={handleSwitch}
									className="group absolute top-4 right-4 rounded-md w-12 h-12 bg-white shadow-lg flex justify-center items-center transition duration-300 hover:bg-primary cursor-pointer"
								>
									<TbSwitchHorizontal className="text-primary group-hover:text-white" />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default memo(MediaLibraryButton)
