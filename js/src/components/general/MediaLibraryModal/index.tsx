import { memo } from 'react'
import { Modal } from 'antd'
import { useAtomValue, useAtom } from 'jotai'
import {
	modalPropsAtom,
	selectedItemsAtom,
	limitAtom,
	filesInQueueAtom,
} from '@/components/general/MediaLibraryModal/atoms'
import { MediaLibrary } from 'antd-toolkit/wp'

export * from '@/components/general/MediaLibraryModal/atoms'

const MediaLibraryModalComponent = () => {
	const modalProps = useAtomValue(modalPropsAtom)
	const [selectedItems, setSelectedItems] = useAtom(selectedItemsAtom)
	const limit = useAtomValue(limitAtom)
	const [filesInQueue, setFilesInQueue] = useAtom(filesInQueueAtom)

	return (
		<Modal {...modalProps}>
			<div className="max-h-[75vh] overflow-x-hidden overflow-y-auto pr-4">
				<MediaLibrary
					selectedItems={selectedItems}
					setSelectedItems={setSelectedItems}
					limit={limit}
					filesInQueue={filesInQueue}
					setFilesInQueue={setFilesInQueue}
				/>
			</div>
		</Modal>
	)
}

export const MediaLibraryModal = memo(MediaLibraryModalComponent)
