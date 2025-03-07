import Table from './Table'
import { atom } from 'jotai'
import { TProductRecord } from '@/types'

export const productsAtom = atom<TProductRecord[]>([])

const index = () => {
	return <Table />
}

export default index
