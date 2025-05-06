import { useState } from 'react'
import { ModalProps, Button, Form, FormItemProps } from 'antd'
import { useSortableTreeList } from '@/components/term'
import { TTaxonomyModalProps } from '@/components/term/TaxonomyModal'

const DEFAULT_MODAL_PROPS: ModalProps = {
	title: '選擇',
	width: 1600,
	centered: true,
	zIndex: 2000,
	className: 'pc-media-library',
}

/** 控制媒體庫 modal 的 props */
export const useTaxonomyModal = (
	name: FormItemProps['name'],
): {
	close: () => void
	open: () => void
	setModalProps: React.Dispatch<React.SetStateAction<ModalProps>>
} & Omit<TTaxonomyModalProps, 'taxonomy' | 'initialValue'> => {
	const form = Form.useFormInstance()
	const [modalProps, setModalProps] = useState<ModalProps>(DEFAULT_MODAL_PROPS)
	const sortableTreeListProps = useSortableTreeList()
	const { selectedTermIds } = sortableTreeListProps

	const close = () => setModalProps((prev) => ({ ...prev, open: false }))
	const open = () => setModalProps((prev) => ({ ...prev, open: true }))

	const handleConfirm = () => {
		close()
		form.setFieldValue(name, selectedTermIds)
	}

	const formattedModalProps = {
		footer: (
			<>
				<Button type="primary" onClick={handleConfirm}>
					確定選取 ({selectedTermIds?.length})
				</Button>
			</>
		),
		onCancel: close,
		...modalProps,
	}

	return {
		close,
		open,
		modalProps: formattedModalProps,
		setModalProps,
		sortableTreeListProps,
	}
}
