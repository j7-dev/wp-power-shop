import Main from './Main'
import ShopClosed from './ShopClosed'
import ShopComing from './ShopComing'
import { useAjaxGetPostMeta } from '@/hooks'
import { postId, snake } from '@/utils'
import { TSettings, defaultSettings } from '@/types'
import dayjs from 'dayjs'

const getStatus = ({
  startTime,
  endTime,
}: {
  startTime: number | undefined
  endTime: number | undefined
}): 'published' | 'coming' | 'closed' => {
  const now = dayjs().valueOf()

  if (!startTime && !endTime) return 'published'

  if (!startTime && endTime) {
    return now < endTime ? 'published' : 'closed'
  }

  if (startTime && !endTime) {
    return now > startTime ? 'published' : 'coming'
  }

  if (startTime && endTime) {
    if (now < startTime) return 'coming'
    if (now > endTime) return 'closed'
    if (now > startTime && now < endTime) return 'published'
  }
  return 'published'
}

const PowerShopProducts = () => {
  const mutation = useAjaxGetPostMeta<TSettings>({
    post_id: postId,
    meta_key: `${snake}_settings`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '{}'),
  })
  const { isLoading, isSuccess, isError } = mutation
  const settings = mutation?.meta ?? defaultSettings
  const startTime = settings?.startTime
  const endTime = settings?.endTime
  const shopStatus = getStatus({ startTime, endTime })

  if (shopStatus === 'published')
    return (
      <Main
        endTime={endTime}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
      />
    )
  if (shopStatus === 'coming') return <ShopComing startTime={startTime} />
  if (shopStatus === 'closed') return <ShopClosed endTime={endTime} />

  return <Main isLoading={isLoading} isSuccess={isSuccess} isError={isError} />
}

export default PowerShopProducts
