import React, { memo, useEffect } from 'react'
import { SortableTree, SortableList } from '@/components/term'
import { TSortableTreeListProps } from '@/components/term/types'
import { SimpleModal, TSimpleModalProps } from 'antd-toolkit'
import { TTaxonomy } from 'antd-toolkit/wp'

export * from '@/components/term/TaxonomyModal/hooks'

export type TTaxonomyModalProps = {
	taxonomy: TTaxonomy
	initialValue: string[]
	sortableTreeListProps: Omit<TSortableTreeListProps, 'taxonomy'>
	modalProps: TSimpleModalProps
}

const TaxonomyModalComponent = ({
	taxonomy,
	initialValue = [],
	sortableTreeListProps,
	modalProps,
}: TTaxonomyModalProps) => {
	const { setSelectedTermIds } = sortableTreeListProps

	useEffect(() => {
		setSelectedTermIds(initialValue)
	}, [JSON.stringify(initialValue)])

	return (
		<SimpleModal {...modalProps} title={`選擇${taxonomy?.label}`}>
			{taxonomy?.hierarchical && (
				<SortableTree {...sortableTreeListProps} taxonomy={taxonomy} />
			)}
			{!taxonomy?.hierarchical && (
				<SortableList {...sortableTreeListProps} taxonomy={taxonomy} />
			)}
		</SimpleModal>
	)
}

export const TaxonomyModal = memo(TaxonomyModalComponent)
