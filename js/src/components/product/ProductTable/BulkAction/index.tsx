import DeleteButton from './DeleteButton'
import ResetPassButton from './ResetPassButton'
import { useAtomValue } from 'jotai'
import { selectedUserIdsAtom } from '@/components/user/UserTable/atom'

const BulkAction = () => {
	const selectedUserIds = useAtomValue(selectedUserIdsAtom)

	return (
		<div className="flex gap-x-2">
			<ResetPassButton
				user_ids={selectedUserIds}
				mode="multiple"
				className="mr-2"
			/>
			<DeleteButton />
		</div>
	)
}

export default BulkAction
