import { useState } from 'react'
import { MediaLibrary, TAttachment, TImage } from 'antd-toolkit/wp'

export const WPMediaLibraryPage = () => {
	const [selectedItems, setSelectedItems] = useState<(TAttachment | TImage)[]>(
		[],
	)

	return (
		<div className="[&_.pc-media-library\_\_tabs\_\_filter]:top-8">
			<MediaLibrary
				selectedItems={selectedItems}
				setSelectedItems={setSelectedItems}
				limit={undefined}
			/>
		</div>
	)
}
