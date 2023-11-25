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
  }
  var wp: {
    blocks: any
  }
}

export {}
