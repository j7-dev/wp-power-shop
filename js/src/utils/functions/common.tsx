import React from 'react'

export const windowOuterWidth = window?.outerWidth || 1200

export const isIphone = /iPhone/.test(navigator.userAgent)

export const renderHTML = (rawHTML: string) =>
  React.createElement('div', { dangerouslySetInnerHTML: { __html: rawHTML } })

export const handleClearZero = (e: React.MouseEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  if (target.value === '0') {
    target.value = ''
  }
}

export const getCopyableJson = (variable: any) => {
  const jsonStringStrippedEscapeC = JSON.stringify(
    JSON.stringify(variable || '{}'),
  ).replace(/\\/g, '')
  const jsonString = jsonStringStrippedEscapeC.slice(
    1,
    jsonStringStrippedEscapeC.length - 1,
  )

  if (typeof variable === 'object') {
    const countKeys = Object.keys(variable).length

    return countKeys === 0 ? '' : jsonString
  }
  return !!variable ? jsonString : ''
}

export const getQueryString = (name: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  const paramValue = urlParams.get(name)
  return paramValue
}

export const getCurrencyString = ({
  price,
  symbol = 'NT$',
}: {
  price: number | string | undefined
  symbol?: string
}) => {
  if (typeof price === 'undefined') return ''
  if (typeof price === 'string') return `${symbol} ${price}`
  return `${symbol} ${price.toString()}`
}

export const getPrice = (cartPrice: number, currency_minor_unit = 0) => {
  return cartPrice / Math.pow(10, currency_minor_unit)
}

export const formatYoutubeLinkToIframe = (rawContent: string) => {
  let content = rawContent
  const youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/g
  const youtubeLinks = content.match(youtubeRegex)

  if (youtubeLinks) {
    // 遍历找到的链接

    for (let i = 0; i < youtubeLinks.length; i++) {
      const videoLink = youtubeLinks[i]

      // 创建嵌入式iframe

      const iframe = document.createElement('iframe')
      const styles = {
        width: '100%',
        border: 'none',
        aspectRatio: '16/9',
      }
      iframe.src =
        'https://www.youtube.com/embed/' +
        videoLink.substr(videoLink.lastIndexOf('=') + 1)
      Object.assign(iframe.style, styles)

      // 替换原始的链接

      content = content.replace(youtubeLinks[i], iframe.outerHTML)
    }
  }

  return content
}
