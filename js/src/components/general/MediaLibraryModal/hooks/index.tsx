import { useState } from 'react'
import { ModalProps, Button, FormItemProps, Form } from 'antd'
import { TAttachment } from 'antd-toolkit/wp'

const DEFAULT_MODAL_PROPS: ModalProps = {
	title: '媒體庫',
	width: 1600,
	centered: true,
	zIndex: 2000,
	className: 'pc-media-library',
}

export const useApiUrlMediaLibraryModal = ({
	name,
	limit,
}: {
	name: FormItemProps['name']
	limit: number
}) => {
	const form = Form.useFormInstance()
	const [modalProps, setModalProps] = useState<ModalProps>(DEFAULT_MODAL_PROPS)
	const [selectedItems, setSelectedItems] = useState<TAttachment[]>([])

	const close = () => setModalProps((prev) => ({ ...prev, open: false }))
	const open = () => setModalProps((prev) => ({ ...prev, open: true }))

	/** 按下[選擇檔案]按鈕後，要把值 set 到 form 裡 */
	const handleConfirm = () => {
		close()
		form.setFieldValue(name, selectedItems)
	}

	const formattedModalProps = {
		footer: (
			<>
				<Button type="primary" onClick={handleConfirm}>
					確定選取 ({selectedItems?.length})
				</Button>
			</>
		),
		onCancel: close,
		destroyOnHidden: true,
		...modalProps,
	}

	return {
		open,
		close,
		limit,
		modalProps: formattedModalProps,
		selectedItems,
		setModalProps,
		setSelectedItems,
	}
}
