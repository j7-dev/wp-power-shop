import { useEnv as useATEnv, TEnv } from 'antd-toolkit'

type Env = TEnv & {
	APP1_SELECTOR: string
	ELEMENTOR_ENABLED: boolean
}

export const useEnv = () => {
	const values = useATEnv<Env>()
	return values
}
