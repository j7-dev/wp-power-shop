import { FC } from 'react'
import { TTerm, DEFAULT } from '@/components/term/types'
import { FlattenNode, useSortableTree } from '@ant-design/pro-editor'
import { Checkbox, CheckboxProps, Tooltip, Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { useAtom } from 'jotai'
import { selectedTermAtom } from '@/components/term/SortableTree/atom'
import { useTaxonomy } from '@/components/term/SortableTree/hooks'
import { flatMapDeep } from 'lodash-es'
import { PopconfirmDelete } from 'antd-toolkit'
import { ProductName as PostName } from 'antd-toolkit/wp'

const NodeRender: FC<{
	node: FlattenNode<TTerm>
	selectedTerms: TTerm[]
	setSelectedTerms: React.Dispatch<React.SetStateAction<TTerm[]>>
}> = ({ node, selectedTerms, setSelectedTerms }) => {
	const [selectedTerm, setSelectedTerm] = useAtom(selectedTermAtom)
	const { label: taxonomyLabel = '', publicly_queryable } = useTaxonomy()
	const { removeNode } = useSortableTree()
	const record = node.content || DEFAULT
	const { permalink, count } = record

	if (!record) {
		return (
			<div>
				{`ID: ${node.id}`} 找不到{taxonomyLabel}資料
			</div>
		)
	}

	const handleDelete = () => {
		removeNode(node.id)
	}

	const getFlattenTerms = (_node: FlattenNode<TTerm>): TTerm[] => {
		if (!_node?.content) {
			return []
		}
		const terms: TTerm[] = [_node.content as TTerm]
		if (_node.children) {
			_node.children.forEach((child) => {
				terms.push(...getFlattenTerms(child as FlattenNode<TTerm>))
			})
		}
		return terms
	}

	const handleCheck: CheckboxProps['onChange'] = (e) => {
		const flattenTerms = getFlattenTerms(node)
		const flattenTermsIds = flattenTerms.map((c) => c.id)
		if (e.target.checked) {
			setSelectedTerms((prev) => [...prev, ...flattenTerms])
		} else {
			setSelectedTerms((prev) =>
				prev.filter((c) => !flattenTermsIds.includes(c.id)),
			)
		}
	}
	const selectedIds = selectedTerms.map((c) => c.id)
	const isChecked = selectedIds.includes(node.id as string)
	const isSelectedChapter = selectedTerm?.id === node.id

	const showPlaceholder = node?.children?.length === 0
	return (
		<div
			className={`grid grid-cols-[1fr_3rem_4rem] gap-4 justify-start items-center cursor-pointer ${isSelectedChapter ? 'bg-[#e6f4ff]' : ''}`}
		>
			<div
				className="flex items-center overflow-hidden"
				onClick={() => setSelectedTerm(record)}
			>
				{showPlaceholder && <div className="w-[28px] h-[28px]"></div>}
				<Checkbox className="mr-2" onChange={handleCheck} checked={isChecked} />
				<PostName className="[&_.at-name]:!text-sm" hideImage record={record} />
			</div>
			<div className="text-xs text-gray-400">
				<Tooltip title={`${taxonomyLabel}項目數量`}>{count}</Tooltip>
			</div>
			<div className="flex gap-2 justify-end">
				{publicly_queryable && (
					<Tooltip title="檢視">
						<Button
							type="link"
							target="_blank"
							href={permalink}
							icon={<ExportOutlined />}
						/>
					</Tooltip>
				)}
				<PopconfirmDelete
					buttonProps={{
						className: 'mr-0',
					}}
					tooltipProps={{ title: `刪除${taxonomyLabel}` }}
					popconfirmProps={{
						description: `刪除會連同子${taxonomyLabel}也一起刪除`,
						onConfirm: handleDelete,
						placement: 'right',
					}}
				/>
			</div>
		</div>
	)
}

export default NodeRender
