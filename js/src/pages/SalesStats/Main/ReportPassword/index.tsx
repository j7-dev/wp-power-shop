import React from 'react'
import { Modal, Input, Alert } from 'antd'
import { KeyOutlined, LinkOutlined } from '@ant-design/icons'
import { useModal, useAjaxPostMeta } from '@/hooks'
import { permalink, postId } from '@/utils'

const ReportPassword = () => {
  const { showModal, modalProps: deaultModalProps, setIsModalOpen } = useModal()

  const handleUpdate = () => {
    setIsModalOpen(false)
  }

  const modalProps = {
    ...deaultModalProps,
    title: '設定頁面報告密碼',
    centered: true,
    onOk: handleUpdate,
  }

  const mutation = useAjaxPostMeta<string>({
    post_id: postId,
    meta_key: 'fast_shop_report_password',
  })
  const reportPassword = mutation?.meta ?? ''

  return (
    <>
      <div
        className="flex items-center my-2  cursor-pointer"
        onClick={showModal}
      >
        <KeyOutlined className="text-yellow-400 text-2xl mr-2" />
        設定頁面報告密碼
      </div>
      <Modal {...modalProps}>
        <div></div>
        <Alert
          message="Power Shop 提供一個頁面報告，使用者可以直接輸入網址與密碼後，直接看到頁面報告"
          type="info"
          className="mb-8"
          showIcon
        />
        <div className="flex justify-between">
          <span>設定密碼</span>
          <a target="_blank" href={`${permalink}report`} rel="noreferrer">
            前往頁面報告
            <LinkOutlined className="ml-1" />
          </a>
        </div>
        <Input defaultValue={reportPassword} />
      </Modal>
    </>
  )
}

export default ReportPassword
