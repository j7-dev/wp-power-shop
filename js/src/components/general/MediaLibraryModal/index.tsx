import { memo } from 'react'
import { Modal, ModalProps } from 'antd'
import { MediaLibrary, TMediaLibraryProps } from 'antd-toolkit/wp'

const MediaLibraryModalComponent = ({
	initialIds,
	modalProps,
	mediaLibraryProps,
}: {
	initialIds: string[]
	modalProps: ModalProps
	mediaLibraryProps: TMediaLibraryProps
}) => {
	return (
		<Modal {...modalProps}>
			<div className="max-h-[75vh] overflow-x-hidden overflow-y-auto pr-4">
				<MediaLibrary initialIds={initialIds} {...mediaLibraryProps} />
			</div>
		</Modal>
	)
}

export const MediaLibraryModal = memo(MediaLibraryModalComponent)
