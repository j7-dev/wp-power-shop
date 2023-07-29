import Main from './Main'
import ShopClose from './ShopClose'
import { LoadingSimple } from '@/components/PureComponents'
import { useAjaxGetPostMeta } from '@/hooks'
import { postId, snake } from '@/utils'
import { TSettings, defaultSettings } from '@/types'
import dayjs from 'dayjs'

const isActivate = ({
  startTime,
  endTime,
}: {
  startTime: number | undefined
  endTime: number | undefined
}) => {
  const now = dayjs().valueOf()

  if (!startTime && !endTime) return true

  if (!startTime && endTime) {
    return now < endTime
  }

  if (startTime && !endTime) {
    return now > startTime
  }

  if (startTime && endTime) {
    return now > startTime && now < endTime
  }
  return true
}

const PowerShopProducts = () => {
  const mutation = useAjaxGetPostMeta<TSettings>({
    post_id: postId,
    meta_key: `${snake}_settings`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '{}'),
  })
  const { isLoading } = mutation
  const settings = mutation?.meta ?? defaultSettings

  const startTime = settings?.startTime
  const endTime = settings?.endTime
  const shopIsActivate = isActivate({ startTime, endTime })

  if (isLoading) {
    return <LoadingSimple />
  }

  return shopIsActivate ? <Main /> : <ShopClose />
}

export default PowerShopProducts
