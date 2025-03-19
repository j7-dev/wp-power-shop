import { useCustom, useApiUrl } from '@refinedev/core'
import { USER_ROLES } from 'antd-toolkit/wp'
import { SelectProps } from 'antd'

export const useOptions = () => {
	const apiUrl = useApiUrl()
	const { data, isLoading } = useCustom({
		url: `${apiUrl}/users/options`,
		method: 'get',
	})
	const roles = (data?.data?.data?.roles as SelectProps['options']) || []
	const formattedRoles = roles?.map(({ value, label }) => ({
		value,
		label: USER_ROLES.find(({ value: v }) => v === value)?.label || label,
	}))
	return {
		roles: formattedRoles,
		isLoading,
	}
}
