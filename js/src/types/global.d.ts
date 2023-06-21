declare global {
  var wpApiSettings: {
    root: string
    nonce: string
  }
  var appData: {
    ajaxUrl: string
    ajaxNonce: string
    ajaxAction: string
    userId: string
    postId: string
  }
}

export {}
