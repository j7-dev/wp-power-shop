import { TAjaxProduct, TPSMeta } from '@/types/custom'

declare global {
  var wpApiSettings: {
    root: string
    nonce: string
  }
  var appData: {
    products_info: {
      products: TAjaxProduct[]
      meta: TPSMeta[]
    }
    settings: {
      power_shop_meta_meta_id: string | null
      colorPrimary: string
      isConfetti: boolean
    }
    env: {
      siteUrl: string
      ajaxUrl: string
      ajaxNonce: string
      userId: string
      postId: string
      permalink: string
      checkoutUrl: string
      APP_NAME: string
      KEBAB: string
      SNAKE: string
      BASE_URL: string
      RENDER_ID_1: string
      RENDER_ID_2: string
      RENDER_ID_3: string
      RENDER_ID_4: string
      API_TIMEOUT: string
    }
  }
  var wp: {
    blocks: any
  }
}

export {}
