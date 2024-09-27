import { TAjaxProduct, TPSMeta } from '@/types/custom'
import { Node } from 'jquery'

declare global {
	interface Window {
		wpApiSettings: {
			root: string
			nonce: string
		}
		appData: {
			products_info: {
				products: TAjaxProduct[]
				meta: TPSMeta[]
			}
			settings: {
				power_shop_meta_meta_id: string | null
				colorPrimary: string
				showConfetti: boolean
				showStock: boolean
				showBuyerCount: boolean
				enableVirtualList: boolean
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
		wp: {
			blocks: any
		}
		jQuery: Node
	}
}

export {}
