import { FC } from 'react'
import { TTerm } from '@/components/term/types'
import { FlattenNode, useSortableTree } from '@ant-design/pro-editor'
import { CopyButton } from '@/components/general'
import { Checkbox, CheckboxProps } from 'antd'
import { useAtom } from 'jotai'
import { selectedTermAtom } from '../atom'
import { PopconfirmDelete } from 'antd-toolkit'
import { POST_STATUS, ProductName as PostName } from 'antd-toolkit/wp'
import { flatMapDeep } from 'lodash-es'

const NodeRender: FC<{
	node: FlattenNode<TTerm>
	selectedIds: string[]
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ node, selectedIds, setSelectedIds }) => {
	const [selectedTerm, setSelectedTerm] = useAtom(selectedTermAtom)
	const { removeNode } = useSortableTree()
	const record = node.content
	if (!record) {
		return <div>{`ID: ${node.id}`} 找不到章節資料</div>
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
			className={`grid grid-cols-[1fr_3rem_2rem] gap-4 justify-start items-center cursor-pointer ${isSelectedChapter ? 'bg-[#e6f4ff]' : ''}`}
			onClick={() => setSelectedTerm(record)}
		>
			<div className="flex items-center overflow-hidden">
				{showPlaceholder && <div className="w-[28px] h-[28px]"></div>}
				<Checkbox className="mr-2" onChange={handleCheck} checked={isChecked} />
				<PostName
					className="[&_.product-name]:!text-sm"
					hideImage
					record={record}
				/>
			</div>
			<div className="text-xs text-gray-400">
				{POST_STATUS.find((item) => item.value === record?.status)?.label}
				{record?.count}
			</div>
			{/* TODO */}
			<div>
				<PopconfirmDelete
					buttonProps={{
						className: 'mr-0',
					}}
					tooltipProps={{ title: '刪除' }}
					popconfirmProps={{
						description: '刪除會連同子文章也一起刪除',
						onConfirm: handleDelete,
					}}
				/>
			</div>
		</div>
	)
}

export default NodeRender
