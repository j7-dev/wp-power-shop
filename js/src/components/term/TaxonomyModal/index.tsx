import React, { memo, useEffect } from 'react'
import { Modal } from 'antd'
import { useAtom } from 'jotai'
import {
	SortableTree,
	SortableList,
	useSortableTreeList,
} from '@/components/term'
import { TTaxonomy } from '@/types/woocommerce'
import { modalPropsAtom } from '@/components/term/TaxonomyModal/atoms'

export * from '@/components/term/TaxonomyModal/atoms'

const TaxonomyModalComponent = ({ taxonomy }: { taxonomy: TTaxonomy }) => {
	const [modalProps, setModalProps] = useAtom(modalPropsAtom)
	const sortableTreeListProps = useSortableTreeList()
	const { selectedTermIds, setSelectedTermIds } = sortableTreeListProps

	useEffect(() => {
		setSelectedTermIds([
			'100',
			'43',
		])
	}, [])

	return (
		<Modal
			{...modalProps}
			title={`選擇${taxonomy?.label}`}
			onCancel={() => setModalProps((prev) => ({ ...prev, open: false }))}
		>
			<div className="max-h-[75vh] overflow-x-hidden overflow-y-auto pr-4">
				{taxonomy?.hierarchical && (
					<SortableTree {...sortableTreeListProps} taxonomy={taxonomy} />
				)}
				{!taxonomy?.hierarchical && (
					<SortableList {...sortableTreeListProps} taxonomy={taxonomy} />
				)}
			</div>
		</Modal>
	)
}

export const TaxonomyModal = memo(TaxonomyModalComponent)
