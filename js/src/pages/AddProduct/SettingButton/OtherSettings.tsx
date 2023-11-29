import React, { useEffect } from 'react'
import { TSettings } from '@/types'
import { ColorPicker, Form, Switch } from 'antd'

const OtherSettings: React.FC<{
  isLoading: boolean
  settings: TSettings
}> = ({ isLoading, settings }) => {
  const form = Form.useFormInstance()

  useEffect(() => {
    if (!isLoading) {
      form.setFieldsValue({
        btnColor: settings?.btnColor,
        isConfetti: settings?.isConfetti ?? true,
      })
    }
  }, [isLoading])
  return (
    <>
      <Form.Item name={['btnColor']} label="按鈕顏色">
        <ColorPicker size="small" showText />
      </Form.Item>

      <Form.Item name={['isConfetti']} label="加入購物車啟用煙火效果" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>
    </>
  )
}

export default OtherSettings
