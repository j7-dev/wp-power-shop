import React from 'react'
import { SiMicrosoftexcel } from 'react-icons/si'
import { filterAtom } from '@/pages/SalesStats/atom'
import { useAtom } from 'jotai'
import { Alert } from 'antd'

const DownloadExcel: React.FC<{
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}> = ({ isLoading, isError, isSuccess }) => {
  const [
    filter,
    setFilter,
  ] = useAtom(filterAtom)

  const handleDownload = () => {
    setFilter((pre) => ({
      ...pre,
      is_download: 1,
    }))
  }

  return (
    <>
      <div
        className="mb-4 text-green-700 cursor-pointer"
        onClick={handleDownload}
      >
        <SiMicrosoftexcel className="mr-1" /> 下載完整 EXCEL
      </div>
      {isSuccess && (
        <Alert
          className="my-4"
          message="已經收到您的請求，資料準備好後將傳送 下載連結 至您的信箱 abc@gmail.com"
          type="success"
          showIcon
        />
      )}
      {isError && (
        <Alert
          className="my-4"
          message="OOPS! 發生錯誤，請稍後再試，或聯絡系統管理員"
          type="error"
          showIcon
        />
      )}
    </>
  )
}

export default DownloadExcel
