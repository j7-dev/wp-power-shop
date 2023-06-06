export const baseUrl = import.meta.env.VITE_BASE_URL || '/'
export const renderId = import.meta.env.VITE_RENDER_ID || 'my-app'
export const renderId2 = import.meta.env.VITE_RENDER_ID_2 || 'my-app'
export const renderId3 = import.meta.env.VITE_RENDER_ID_3 || 'my-app'
export const apiUrl = window?.appData?.apiUrl || '/wp-json'
export const currentUserId = window?.appData?.userId || 0
export const postId = window?.appData?.postId || 0

export const apiTimeout = import.meta.env.VITE_API_TIMEOUT || '30000'
