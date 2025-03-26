import { TUserBaseRecord } from 'antd-toolkit/wp'

/** List 用 */
export type TUserRecord = TUserBaseRecord & {}

/** Edit 用 */
export type TUserDetails = TUserRecord & {
	first_name: string
	last_name: string
	description: string
}
