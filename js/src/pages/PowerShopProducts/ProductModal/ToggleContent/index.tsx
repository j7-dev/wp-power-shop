import React, { useState, useRef, useEffect } from 'react'
import { renderHTML } from '@/utils'
import { Button } from 'antd'
import { useAtom } from 'jotai'
import {
  isExpandAtom,
  showReadMoreAtom,
} from '@/pages/PowerShopProducts/ProductModal/atom'

const ToggleContent: React.FC<{ content: string }> = ({ content }) => {
  const [
    isExpand,
    setIsExpand,
  ] = useAtom(isExpandAtom)
  const [
    showReadMore,
    setShowReadMore,
  ] = useAtom(showReadMoreAtom)
  const html = renderHTML(content)

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (divRef) {
        const divHeight = divRef.current?.clientHeight || 0
        if (divHeight > 300) {
          setShowReadMore(true)
        } else {
          setShowReadMore(false)
        }
      }
    }, 0)

    return () => {
      clearTimeout(timeOut)
    }
  }, [
    divRef,
    content,
  ])

  const handleExpand = () => {
    setIsExpand(true)
  }

  return (
    <>
      <div ref={divRef} className="h-full overflow-hidden relative">
        <div className={`${isExpand ? 'h-full' : 'h-[18rem]'}`}>{html}</div>
        {!isExpand && showReadMore && (
          <div
            onClick={handleExpand}
            className="absolute bottom-0 text-center w-full pb-4 pt-12 bg-gradient-to-t from-white to-white/0 cursor-pointer"
          ></div>
        )}
      </div>
    </>
  )
}

export default ToggleContent
