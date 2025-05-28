import { Button, Form, FormItemProps } from 'antd'
import { useSortableTreeList } from '@/components/term'
import { useSimpleModal, TSimpleModalProps } from 'antd-toolkit'
import { TSortableTreeListProps } from '@/components/term/types'

/** 控制媒體庫 modal 的 props */
export const useTaxonomyModal = (
	name: FormItemProps['name'],
): {
	show: () => void
	close: () => void
	modalProps: TSimpleModalProps
	setModalProps: React.Dispatch<React.SetStateAction<TSimpleModalProps>>
	sortableTreeListProps: Omit<TSortableTreeListProps, 'taxonomy'>
} => {
	const form = Form.useFormInstance()
	const { show, close, modalProps, setModalProps } = useSimpleModal()
	const sortableTreeListProps = useSortableTreeList()
	const { selectedTermIds } = sortableTreeListProps

	const handleConfirm = () => {
		close()
		form.setFieldValue(name, selectedTermIds)
	}

	const formattedModalProps = {
		title: '選擇',
		className: 'pc-media-library',
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
		show,
		modalProps: formattedModalProps,
		setModalProps,
		sortableTreeListProps,
	}
}
