import DeleteButton from './DeleteButton'
import UpdateButton from './UpdateButton'

const BulkAction = () => {
	return (
		<div className="flex gap-x-2 items-end">
			<UpdateButton />
			<DeleteButton />
		</div>
	)
}

export default BulkAction
