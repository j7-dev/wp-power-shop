import React, { useState, useEffect, useCallback } from 'react'
import { debounce, isEqual } from 'lodash-es'
import { TPagination } from '@/types'

export function useInfinityScroll<T>({
  setQueryParams,
  setEnabled,
  isLoading,
  list,
}: {
  setQueryParams: React.Dispatch<React.SetStateAction<TPagination>>
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  list: T[]
}) {
  const [
    copyList,
    setCopyList,
  ] = useState<T[]>([])
  const [
    isBottom,
    setIsBottom,
  ] = useState(false)

  const handleScroll = useCallback(
    debounce(() => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const distanceToBottom = documentHeight - (scrollTop + windowHeight)

      // start fetching when the distance to bottom is over threshold

      const threshold = 0.5 * documentHeight

      if (distanceToBottom <= threshold) {
        setQueryParams((pre: TPagination) => {
          const offset = pre?.offset || 0
          const per_page = pre?.per_page || 10
          const newQueryParams = {
            ...pre,
            offset: offset + 1 * per_page,
          }
          if (!isEqual(pre, newQueryParams)) {
            return newQueryParams
          }
          return pre
        })

        setIsBottom(true)
      } else {
        setIsBottom(false)
      }
    }, 500),
    [],
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && list.length > 0) {
      setCopyList((pre: T[]) => {
        if (!isEqual(pre, list)) {
          return [
            ...pre,
            ...list,
          ]
        }
        return pre
      })
    }
    if (!isLoading && list.length === 0) {
      setEnabled(false)
    }
  }, [isLoading])

  return {
    copyList,
    isBottom,
  }
}
