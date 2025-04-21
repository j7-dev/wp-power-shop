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
	selectedIds: string[]
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ node, selectedIds, setSelectedIds }) => {
	const [selectedTerm, setSelectedTerm] = useAtom(selectedTermAtom)
	const { label: taxonomyLabel = '' } = useTaxonomy()
	const { removeNode } = useSortableTree()
	const record = node.content || DEFAULT
	const { id, name, permalink, count } = record

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

	const getFlattenChildrenIds = (_node: FlattenNode<TTerm>): string[] => {
		return flatMapDeep([_node], (__node: FlattenNode<TTerm>) => [
			__node?.id as string,
			...__node?.children?.map((child) =>
				getFlattenChildrenIds(child as FlattenNode<TTerm>),
			),
		])
	}

	const handleCheck: CheckboxProps['onChange'] = (e) => {
		const flattenChildrenIds = getFlattenChildrenIds(node)
		if (e.target.checked) {
			setSelectedIds((prev) => [...prev, ...flattenChildrenIds])
		} else {
			setSelectedIds((prev) =>
				prev.filter((id) => !flattenChildrenIds.includes(id)),
			)
		}
	}
	const isChecked = selectedIds.includes(node.id as string)
	const isSelectedChapter = selectedTerm?.id === node.id

	const showPlaceholder = node?.children?.length === 0
	return (
		<div
			className={`grid grid-cols-[1fr_3rem_4rem] gap-4 justify-start items-center cursor-pointer ${isSelectedChapter ? 'bg-[#e6f4ff]' : ''}`}
			onClick={() => setSelectedTerm(record)}
		>
			<div className="flex items-center overflow-hidden">
				{showPlaceholder && <div className="w-[28px] h-[28px]"></div>}
				<Checkbox className="mr-2" onChange={handleCheck} checked={isChecked} />
				<PostName className="[&_.at-name]:!text-sm" hideImage record={record} />
			</div>
			<div className="text-xs text-gray-400">
				<Tooltip title={`${taxonomyLabel}項目數量`}>{count}</Tooltip>
			</div>
			<div className="flex gap-2">
				<Tooltip title="檢視">
					<Button
						type="link"
						target="_blank"
						href={permalink}
						icon={<ExportOutlined />}
					/>
				</Tooltip>
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
