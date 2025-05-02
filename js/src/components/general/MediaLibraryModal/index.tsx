import { memo, useEffect } from 'react'
import { Modal } from 'antd'
import { useAtomValue, useAtom } from 'jotai'
import {
	modalPropsAtom,
	selectedItemsAtom,
	limitAtom,
	filesInQueueAtom,
	selectButtonPropsAtom,
} from '@/components/general/MediaLibraryModal/atoms'
import { MediaLibrary } from 'antd-toolkit/wp'

export * from '@/components/general/MediaLibraryModal/atoms'

const MediaLibraryModalComponent = () => {
	const [modalProps, setModalProps] = useAtom(modalPropsAtom)
	const [selectedItems, setSelectedItems] = useAtom(selectedItemsAtom)
	const limit = useAtomValue(limitAtom)
	const [filesInQueue, setFilesInQueue] = useAtom(filesInQueueAtom)

	const { onClick, ...restButtonProps } = useAtomValue(selectButtonPropsAtom)

	/**
	 * 按下[選取檔案]按鈕後的行為
	 * 將 onClick 提取出來，這樣不用每次都還要寫關閉 Modal
	 * */
	const onSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
		setModalProps((prev) => ({ ...prev, open: false }))
		if (onClick) {
			onClick?.(e)
		}
	}

	/** 每次開關 Modal 時，清除所選的項目 */
	useEffect(() => {
		// 開啟時，清空，避免破壞關閉後要同步到表單資料的行為
		if (modalProps?.open) {
			setSelectedItems([])
		}
	}, [modalProps?.open])

	return (
		<Modal
			{...modalProps}
			onCancel={() => setModalProps((prev) => ({ ...prev, open: false }))}
		>
			<div className="max-h-[75vh] overflow-x-hidden overflow-y-auto pr-4">
				<MediaLibrary
					selectedItems={selectedItems}
					setSelectedItems={setSelectedItems}
					limit={limit}
					filesInQueue={filesInQueue}
					setFilesInQueue={setFilesInQueue}
					selectButtonProps={{
						onClick: onSelect,
						...restButtonProps,
					}}
				/>
			</div>
		</Modal>
	)
}

export const MediaLibraryModal = memo(MediaLibraryModalComponent)
