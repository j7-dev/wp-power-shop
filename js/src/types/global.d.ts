import { TAjaxProduct, TPSMeta } from '@/types/custom'

declare global {
  var wpApiSettings: {
    root: string
    nonce: string
  }
  var appData: {
    siteUrl: string
    ajaxUrl: string
    ajaxNonce: string
    userId: string
    postId: string
    metaIds: {
      power_shop_meta: string | null
    }
    permalink: string
    checkoutUrl: string
    elLicenseCode: string
    products_info: {
      products: TAjaxProduct[]
      meta: TPSMeta[]
    }
    colorPrimary: string
    isConfetti: boolean
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
  var wp: {
    blocks: any
  }
}

export {}
