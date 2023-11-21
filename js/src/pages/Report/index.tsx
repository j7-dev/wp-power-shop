import { useState } from 'react'
import { Input, Button, Form } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import { useAjaxGetPostMeta } from '@/hooks'
import { postId, snake } from '@/utils'
import SalesStats from '@/pages/SalesStats'

const Report = () => {
  const [form] = Form.useForm()
  const result = useAjaxGetPostMeta<string>({
    post_id: postId,
    meta_key: `${snake}_report_password`,
  })
  const fetchedPassword = result?.meta ?? ''
  const decryptedReportPassword = atob(fetchedPassword)

  const [
    showReport,
    setShowReport,
  ] = useState(false)
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { password } = values
      setShowReport(password === decryptedReportPassword)
    })
  }

  if (showReport) {
    return <SalesStats />
  }

  return (
    <Form form={form}>
      <div className="w-[20rem] mx-auto my-16">
        <div className="text-center">
          <KeyOutlined className="text-yellow-500 text-[4rem] mb-8" />
        </div>
        <Form.Item
          name={['password']}
          rules={[
            { required: true, message: '請輸入密碼' },
            {
              pattern: new RegExp(decryptedReportPassword),
              message: '密碼錯誤',
            },
          ]}
          className="mb-8"
          hasFeedback={true}>
          <Input.Password allowClear className="w-full" placeholder="請輸入密碼" size="large" />
        </Form.Item>
        <Form.Item noStyle>
          <Button htmlType="submit" className="w-full" size="large" type="primary" onClick={handleSubmit}>
            送出
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default Report
