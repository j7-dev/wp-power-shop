import { TDocBaseRecord } from '@/pages/admin/Docs/List/types'
import { useItemSelect } from 'antd-toolkit/wp'
import { useEnv } from 'antd-toolkit'
import { objToCrudFilters } from 'antd-toolkit/refine'

export const useDocSelect = () => {
	const { DOCS_POST_TYPE } = useEnv()
	const data = useItemSelect<TDocBaseRecord>({
		useSelectProps: {
			resource: 'posts',
			filters: objToCrudFilters({
				post_type: DOCS_POST_TYPE,
			}),
		},
	})
	return data
}
