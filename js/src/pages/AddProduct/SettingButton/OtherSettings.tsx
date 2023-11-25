import React, { useEffect } from 'react'
import { TSettings } from '@/types'
import { ColorPicker, Form } from 'antd'

const OtherSettings: React.FC<{
  isLoading: boolean
  settings: TSettings
}> = ({ isLoading, settings }) => {
  const form = Form.useFormInstance()

  useEffect(() => {
    if (!isLoading) {
      form.setFieldsValue({
        btnColor: settings?.btnColor,
      })
    }
  }, [isLoading])
  return (
    <>
      <p className="text-lg">設定按鈕顏色</p>
      <Form.Item name={['btnColor']}>
        <ColorPicker size="small" showText />
      </Form.Item>
    </>
  )
}

export default OtherSettings
