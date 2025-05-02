import { FC } from 'react'
import { TTerm } from '@/components/term/types'
import { Checkbox, CheckboxProps, Tooltip, Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { useAtom } from 'jotai'
import { selectedTermAtom } from '@/components/term/SortableList/atom'
import { useTaxonomy } from '@/components/term/SortableList/hooks'
import { useDelete } from '@refinedev/core'
import { PopconfirmDelete } from 'antd-toolkit'
import { ProductName as PostName } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

const NodeRender: FC<{
	record: TTerm
	selectedTerms: TTerm[]
	setSelectedTerms: React.Dispatch<React.SetStateAction<TTerm[]>>
}> = ({ record, selectedTerms, setSelectedTerms }) => {
	const [selectedTerm, setSelectedTerm] = useAtom(selectedTermAtom)
	const {
		label: taxonomyLabel = '',
		value: taxonomy,
		publicly_queryable,
	} = useTaxonomy()
	const { id, permalink, count } = record
	const { mutate: deleteTerm, isLoading: isDeleting } = useDelete()

	const handleDelete = () => {
		deleteTerm({
			resource: `terms/${taxonomy}`,
			id,
			...notificationProps,
		})
	}

	const handleCheck: CheckboxProps['onChange'] = (e) => {
		if (e.target.checked) {
			setSelectedTerms((prev) => [...prev, record])
		} else {
			setSelectedTerms((prev) => prev.filter((c) => c.id !== id))
		}
	}
	const selectedIds = selectedTerms.map((c) => c.id)
	const isChecked = selectedIds.includes(id)
	const isSelected = selectedTerm?.id === id

	return (
		<div
			className={`grid grid-cols-[1fr_3rem_4rem] gap-4 justify-start items-center cursor-pointer ${isSelected ? 'bg-[#e6f4ff]' : ''}`}
		>
			<div
				className="flex items-center overflow-hidden"
				onClick={() => setSelectedTerm(record)}
			>
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
						loading: isDeleting,
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
