import { Tooltip, Button } from 'antd'

const SelectedUser = ({
	user_ids,
	onClear,
	onSelected,
}: {
	user_ids: string[]
	onClear?: () => void
	onSelected?: () => void
}) => {
	return (
		<div>
			{!!user_ids.length && (
				<div className="flex gap-x-2 items-center">
					<Tooltip
						title={`包含用戶 id: ${user_ids.join(',')}`}
						className="bg-yellow-100 px-2 py-0.5 whitespace-nowrap rounded-[0.25rem]"
					>
						已選擇 {user_ids.length} 個用戶
					</Tooltip>
					{onClear && (
						<Button type="link" onClick={onClear}>
							清除選取
						</Button>
					)}

					{onSelected && (
						<Button type="link" onClick={onSelected}>
							顯示已選用戶
						</Button>
					)}
				</div>
			)}
			{!user_ids.length && <div className="h-8" />}
		</div>
	)
}

export default SelectedUser
