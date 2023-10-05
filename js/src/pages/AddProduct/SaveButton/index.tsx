import { Tooltip, Button, ButtonProps, Form } from 'antd'
import useSave from './useSave'

const SaveButton: React.FC<ButtonProps> = (props) => {
  const form = Form.useFormInstance()
  const { handleSave, isLoading } = useSave(form)

  return (
    <>
      <Tooltip title="按此儲存按鈕才會儲存商品資料">
        <Button {...props} onClick={handleSave} loading={isLoading}>
          儲存
        </Button>
      </Tooltip>
    </>
  )
}

export default SaveButton
