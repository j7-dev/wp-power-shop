import { postId, snake } from '@/utils'
import { useAjaxGetPostMeta } from '@/hooks'
import { TPSMeta } from '@/types'

const usePSMeta = () => {
  const result = useAjaxGetPostMeta<TPSMeta[]>({
    post_id: postId,
    meta_key: `${snake}_meta`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '[]'),
  })
  const shop_meta = result?.meta ?? []

  return {
    ...result,
    shop_meta,
  }
}

export default usePSMeta
