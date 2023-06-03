export type TImage = {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  src: string
  name: string
  alt: string
}

export type TProductCat = {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  display: string
  image: TImage | null
  menu_order: number
  count: number
  _links: {
    [key: string]: any
  }
}
