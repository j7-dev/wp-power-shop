export const keyLabelMapper = (key: string | number | symbol): string => {
	switch (key) {
		case 'search':
			return '關鍵字'
		case 'role__in':
			return '角色'
		case 'billing_phone':
			return '手機'
		case 'pc_birthday':
			return '生日'
		default:
			return key as string
	}
}
