import axios, { AxiosInstance } from 'axios'
import { baseUrl, apiTimeout } from '@/utils'

const wpApiSettings = window?.wpApiSettings || {}

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: parseInt(apiTimeout, 10),
  headers: {
    'X-WP-Nonce': wpApiSettings?.nonce || '',
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger

    // const type = response?.data?.type
    // const method = response?.config?.method || ''
    // const statusText = response?.statusText
    // const typeText = getTypeText(type, method, statusText)
    // if (method !== 'get') {
    //   console.log(`${typeText} success`)
    // }

    return response
  },
  async function (error) {
    const status: number = error?.response?.status ?? 500
    const refreshCount = Number(sessionStorage.getItem('refreshCount') || '0')
    if (status === 403 && refreshCount < 2) {
      // 如果 403 就刷新頁面最多2次吧

      sessionStorage.setItem('refreshCount', (refreshCount + 1).toString())
      setTimeout(() => {
        window.location.reload()
      }, 0)

      // 以下是用 invalidate 不刷新頁面的方法，但有時候不一定是 nonce 錯，有時候是 cookie 錯
      // queryClient.invalidateQueries(['get_ajax_nonce'])
      // queryClient.invalidateQueries(['get_post_meta'])
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger

    console.log('error', error)

    return Promise.reject(error)
  },
)

export default instance
