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
        showConfetti: settings?.showConfetti ?? true,
        showStock: settings?.showStock ?? true,
        showBuyerCount: settings?.showBuyerCount ?? true,
      })
    }
  }, [isLoading])
  return (
    <>
      <Form.Item name={['btnColor']} label="按鈕顏色">
        <ColorPicker size="small" showText />
      </Form.Item>

      <Form.Item name={['showConfetti']} label="加入購物車啟用煙火效果" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>

      <Form.Item name={['showStock']} label="顯示庫存資訊" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>

      <Form.Item name={['showBuyerCount']} label="顯示有多少人購買過此商品" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>
    </>
  )
}

export default OtherSettings
