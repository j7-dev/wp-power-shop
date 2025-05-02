import { useState } from 'react'
import { UploadFile } from 'antd'
import { MediaLibrary, TAttachment } from 'antd-toolkit/wp'

export const WPMediaLibraryPage = () => {
	const [selectedItems, setSelectedItems] = useState<TAttachment[]>([])
	const [filesInQueue, setFilesInQueue] = useState<UploadFile[]>([])

	return (
		<div className="[&_.pc-media-library\_\_tabs\_\_filter]:top-8">
			<MediaLibrary
				selectedItems={selectedItems}
				setSelectedItems={setSelectedItems}
				filesInQueue={filesInQueue}
				setFilesInQueue={setFilesInQueue}
				selectButtonProps={{
					className: 'tw-hidden',
				}}
			/>
		</div>
	)
}
