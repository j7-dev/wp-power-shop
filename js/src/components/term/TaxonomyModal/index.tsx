import React, { memo, useEffect } from 'react'
import { Modal, ModalProps } from 'antd'
import { SortableTree, SortableList } from '@/components/term'
import { TSortableTreeListProps } from '@/components/term/types'
import { TTaxonomy } from '@/types/woocommerce'

export * from '@/components/term/TaxonomyModal/hooks'

export type TTaxonomyModalProps = {
	taxonomy: TTaxonomy
	initialValue: string[]
	sortableTreeListProps: Omit<TSortableTreeListProps, 'taxonomy'>
	modalProps: ModalProps
	setModalProps: React.Dispatch<React.SetStateAction<ModalProps>>
}

const TaxonomyModalComponent = ({
	taxonomy,
	initialValue = [],
	sortableTreeListProps,
	modalProps,
	setModalProps,
}: TTaxonomyModalProps) => {
	const { setSelectedTermIds } = sortableTreeListProps

	useEffect(() => {
		setSelectedTermIds(initialValue)
	}, [JSON.stringify(initialValue)])

	return (
		<Modal {...modalProps} title={`選擇${taxonomy?.label}`}>
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
