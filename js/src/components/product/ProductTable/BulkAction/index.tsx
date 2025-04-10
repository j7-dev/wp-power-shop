import DeleteButton from './DeleteButton'
import UpdateButton from './UpdateButton'
import { useAtomValue } from 'jotai'
import { selectedUserIdsAtom } from '@/components/user/UserTable/atom'

const BulkAction = () => {
	const selectedUserIds = useAtomValue(selectedUserIdsAtom)

	return (
		<div className="flex gap-x-2">
			<UpdateButton />
			<DeleteButton />
		</div>
	)
}

export default BulkAction
