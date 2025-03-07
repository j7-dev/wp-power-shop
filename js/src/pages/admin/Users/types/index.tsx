import { TUserBaseRecord } from 'antd-toolkit/wp'
import { TGrantedItemBase } from 'antd-toolkit/refine'

export type TGrantedDoc = TGrantedItemBase

export type TUserRecord = TUserBaseRecord & {
	granted_docs: TGrantedDoc[]
}
