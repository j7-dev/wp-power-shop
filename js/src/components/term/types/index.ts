export type TTerm = {
	id: string
	name: string
	slug: string
	term_taxonomy_id: string
	taxonomy: string
	description: string
	parent: string
	count: number
	order: number
	children: TTerm[] | null
}
