import { postId, snake } from '@/utils'
import { useAjaxGetPostMeta } from '@/hooks'
import { TPSMeta } from '@/types'

const usePSMeta = () => {
  const mutation = useAjaxGetPostMeta<TPSMeta[]>({
    post_id: postId,
    meta_key: `${snake}_meta`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '[]'),
  })
  const shop_meta = mutation?.meta ?? []

  return {
    ...mutation,
    shop_meta,
  }
}

export default usePSMeta
