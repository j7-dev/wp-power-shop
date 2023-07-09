declare global {
  var wpApiSettings: {
    root: string
    nonce: string
  }
  var appData: {
    ajaxUrl: string
    ajaxNonce: string
    userId: string
    postId: string
    checkoutUrl: string
  }
}

export {}
