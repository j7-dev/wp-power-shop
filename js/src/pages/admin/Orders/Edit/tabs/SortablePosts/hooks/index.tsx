import { TOrderRecord } from '@/pages/admin/Orders/List/types'
import { useList, HttpError } from '@refinedev/core'
import { Form } from 'antd'
import { useAtomValue } from 'jotai'
import { selectedPostAtom } from '../atom'
import { useEnv } from 'antd-toolkit'
import { objToCrudFilters } from 'antd-toolkit/refine'

export const usePostsList = () => {
	const { DOCS_POST_TYPE = '' } = useEnv()
	const form = Form.useFormInstance()
	const parent_id = form?.getFieldValue('id')
	const query = useList<TOrderRecord, HttpError>({
		resource: 'orders',
		filters: objToCrudFilters({
			post_parent: parent_id,
			post_type: DOCS_POST_TYPE,
			with_description: 'true',
			recursive_args: '[]',
			meta_keys: ['editor'],
		}),
		pagination: {
			current: 1,
			pageSize: -1,
		},
	})

	return query
}

export const useSelectedPost = () => {
	return useAtomValue(selectedPostAtom)
}
