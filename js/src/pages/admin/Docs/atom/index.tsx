import { atom } from 'jotai'
import { ModalProps, FormInstance } from 'antd'
import { TMediaLibraryProps } from '@/bunny'
import { TBunnyVideo } from '@/bunny/types'

export const mediaLibraryAtom = atom<{
	form?: FormInstance
	name?: string[]
	onSelect?: () => void
	modalProps: ModalProps
	mediaLibraryProps: Omit<TMediaLibraryProps, 'setSelectedVideos'>
	confirmedSelectedVideos: TBunnyVideo[]
	key: string
}>({
	form: undefined,
	name: undefined,
	modalProps: {
		title: 'Bunny 媒體庫',
		open: false,
		width: 1600,
		footer: null,
		centered: true,
		zIndex: 2000,
		className: 'pc-media-library',

		// destroyOnClose: true,
	},
	mediaLibraryProps: {
		limit: 1,
		selectedVideos: [],
	},
	confirmedSelectedVideos: [],
	key: '',
})
