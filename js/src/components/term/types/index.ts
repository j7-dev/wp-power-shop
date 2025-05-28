import { TTaxonomy } from 'antd-toolkit/wp'

export type TTerm = {
	id: string
	name: string
	slug: string
	permalink: string
	edit_url: string
	term_taxonomy_id: string
	taxonomy: string
	description: string
	parent: string
	count: number
	order: number
	children: TTerm[] | null
	thumbnail_id: string
}


export const  DEFAULT: TTerm = {
	id: '',
	name: '',
	slug: '',
	permalink: '',
	edit_url: '',
	term_taxonomy_id: '',
	taxonomy: '',
	description: '',
	parent: '',
	count: 0,
	order: 0,
	children: null,
	thumbnail_id: '',
}



export type TSortableTreeListProps = {
	taxonomy: TTaxonomy
	selectedTermIds: string[]
	setSelectedTermIds: React.Dispatch<React.SetStateAction<string[]>>
	selectedTermId: string | null
	setSelectedTermId: React.Dispatch<React.SetStateAction<string | null>>
	Edit?: React.FC<{ record: TTerm; taxonomy: TTaxonomy }>
}
