export const keyLabelMapper = (key: string | number | symbol): string => {
	switch (key) {
		case 'granted_docs':
			return '已開通課程'
		default:
			return key as string
	}
}
