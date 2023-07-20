import { useState, useEffect } from 'react'
import { Modal, Input, Alert, notification } from 'antd'
import { KeyOutlined, LinkOutlined } from '@ant-design/icons'
import { useModal, useAjaxGetPostMeta, useAjax } from '@/hooks'
import { permalink, postId, ajaxNonce } from '@/utils'

const ReportPassword = () => {
  const [
    api,
    contextHolder,
  ] = notification.useNotification()
  const [
    reportPassword,
    setReportPassword,
  ] = useState('')
  const { showModal, modalProps: deaultModalProps, setIsModalOpen } = useModal()

  const updateMutation = useAjax()
  const { mutate: updatePostMeta, isLoading: updateIsLoading } = updateMutation

  const handleUpdate = () => {
    setIsModalOpen(false)
    updatePostMeta(
      {
        action: 'handle_update_post_meta',
        nonce: ajaxNonce,
        post_id: postId,
        meta_key: 'fast_shop_report_password',
        meta_value: reportPassword,
      },
      {
        onSuccess: () => {
          api.success({
            message: '頁面報告密碼更新成功',
          })
        },
        onError: (error) => {
          console.log(error)
          api.error({
            message: '頁面報告密碼更新失敗，請再試一次',
          })
        },
      },
    )
  }

  const modalProps = {
    ...deaultModalProps,
    title: '設定頁面報告密碼',
    centered: true,
    onOk: handleUpdate,
    okText: '儲存',
    cancelText: '取消',
    confirmLoading: updateIsLoading,
  }

  const mutation = useAjaxGetPostMeta<string>({
    post_id: postId,
    meta_key: 'fast_shop_report_password',
  })
  const fetchedReportPassword = mutation?.meta ?? ''

  useEffect(() => {
    if (fetchedReportPassword) {
      setReportPassword(fetchedReportPassword)
    }
  }, [fetchedReportPassword])

  return (
    <>
      {contextHolder}
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
        <Input
          value={reportPassword}
          onChange={(e) => {
            setReportPassword(e.target.value)
          }}
        />
      </Modal>
    </>
  )
}

export default ReportPassword
