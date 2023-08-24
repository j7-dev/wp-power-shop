import { useEffect } from 'react'
import Main from './Main'
import ShopClosed from './ShopClosed'
import ShopComing from './ShopComing'
import { useAjaxGetPostMeta } from '@/hooks'
import { postId, snake } from '@/utils'
import { TSettings, defaultSettings } from '@/types'
import dayjs from 'dayjs'
import { message } from 'antd'

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
  const { isLoading } = mutation
  const settings = mutation?.meta ?? defaultSettings
  const startTime = settings?.startTime
  const endTime = settings?.endTime
  const shopStatus = getStatus({ startTime, endTime })

  useEffect(() => {
    const els = document.querySelectorAll('div[data-ps-product-id]') ?? []
    if (isLoading) {
      message.open({
        key: 'jsLoaded',
        type: 'loading',
        content: ' 商品載入中 ...',
        duration: 0,
      })

      els.forEach((el) => {
        el.classList.add('ps-not-ready')
      })
    } else {
      message.open({
        key: 'jsLoaded',
        type: 'success',
        content: ' 商品載入完成',
        duration: 2,
      })

      // message.destroy('jsLoaded')

      els.forEach((el) => {
        el.classList.remove('ps-not-ready')
      })
    }
  }, [isLoading])

  if (shopStatus === 'published') return <Main endTime={endTime} />
  if (shopStatus === 'coming') return <ShopComing startTime={startTime} />
  if (shopStatus === 'closed') return <ShopClosed endTime={endTime} />

  return <Main />
}

export default PowerShopProducts
