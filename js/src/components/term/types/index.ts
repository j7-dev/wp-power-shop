export type TTerm = {
	id: string
	name: string
	slug: string
	permalink: string
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
	term_taxonomy_id: '',
	taxonomy: '',
	description: '',
	parent: '',
	count: 0,
	order: 0,
	children: null,
	thumbnail_id: '',
}

