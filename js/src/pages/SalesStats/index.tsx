import React from 'react'
import Main from './Main'
import { isAdminAtom } from '@/pages/SalesStats/atom'
import { useSetAtom } from 'jotai'

const SalesStats: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const setIsAdmin = useSetAtom(isAdminAtom)
  setIsAdmin(isAdmin)
  return (
    <div className="p-4">
      <Main />
    </div>
  )
}

export default SalesStats
