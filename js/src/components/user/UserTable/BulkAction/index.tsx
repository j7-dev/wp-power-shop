import DeleteButton from './DeleteButton'
import ResetPassButton from './ResetPassButton'

const BulkAction = () => {
	return (
		<div className="flex gap-x-2">
			<ResetPassButton />
			<DeleteButton />
		</div>
	)
}

export default BulkAction
