type TImage = {
  id: number
  src: string
  thumbnail: string
  srcset: string
  sizes: string
  name: string
  alt: string
}

export type TProductBase = {
  id: number
  name: string
  parent: number
  type: string
  variation: string
  permalink: string
  sku: string
  short_description: string
  description: string
  on_sale: boolean
  prices: {
    price: string
    regular_price: string
    sale_price: string
    price_range: {
      min_amount: string
      max_amount: string
    } | null
    currency_code: string
    currency_symbol: string
    currency_minor_unit: number
    currency_decimal_separator: string
    currency_thousand_separator: string
    currency_prefix: string
    currency_suffix: string
  }
  price_html: string
  average_rating: string
  review_count: number
  images: TImage[]
}

export type TProduct = TProductBase & {
  categories: [
    {
      id: 19
      name: 'Accessories'
      slug: 'accessories'
      link: 'http://wpdev.local/product-category/clothing/accessories/'
    },
  ]
  tags: []
  attributes: []
  variations: []
  has_options: false
  is_purchasable: true
  is_in_stock: true
  is_on_backorder: false
  low_stock_remaining: null
  sold_individually: false
  add_to_cart: {
    text: 'Add to cart'
    description: 'Add &ldquo;Belt&rdquo; to your cart'
    url: '?add-to-cart=17'
    minimum: 1
    maximum: 9999
    multiple_of: 1
  }
  extensions: {}
}

export type TProductVariation = TProductBase & {
  categories: [
    {
      id: 18
      name: 'Hoodies'
      slug: 'hoodies'
      link: 'http://wpdev.local/product-category/clothing/hoodies/'
    },
  ]
  tags: []
  attributes: [
    {
      id: 1
      name: 'Color'
      taxonomy: 'pa_color'
      has_variations: true
      terms: [
        {
          id: 22
          name: 'Blue'
          slug: 'blue'
        },
        {
          id: 23
          name: 'Green'
          slug: 'green'
        },
        {
          id: 24
          name: 'Red'
          slug: 'red'
        },
      ]
    },
    {
      id: 0
      name: 'Logo'
      taxonomy: null
      has_variations: true
      terms: [
        {
          id: 0
          name: 'Yes'
          slug: 'Yes'
        },
        {
          id: 0
          name: 'No'
          slug: 'No'
        },
      ]
    },
  ]
  variations: [
    {
      id: 36
      attributes: [
        {
          name: 'Color'
          value: 'blue'
        },
        {
          name: 'Logo'
          value: 'Yes'
        },
      ]
    },
    {
      id: 29
      attributes: [
        {
          name: 'Color'
          value: 'red'
        },
        {
          name: 'Logo'
          value: 'No'
        },
      ]
    },
    {
      id: 30
      attributes: [
        {
          name: 'Color'
          value: 'green'
        },
        {
          name: 'Logo'
          value: 'No'
        },
      ]
    },
    {
      id: 31
      attributes: [
        {
          name: 'Color'
          value: 'blue'
        },
        {
          name: 'Logo'
          value: 'No'
        },
      ]
    },
  ]
  has_options: true
  is_purchasable: true
  is_in_stock: true
  is_on_backorder: false
  low_stock_remaining: null
  sold_individually: false
  add_to_cart: {
    text: 'Select options'
    description: 'Select options for &ldquo;Hoodie&rdquo;'
    url: 'http://wpdev.local/product/hoodie/'
    minimum: 1
    maximum: 9999
    multiple_of: 1
  }
  extensions: {}
}
