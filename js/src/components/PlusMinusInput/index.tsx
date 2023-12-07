import { FC } from 'react'
import { InputNumber, InputNumberProps } from 'antd'
import './style.scss'

const PlusMinusInput: FC<InputNumberProps> = ({ ...inputNumberProps }) => {
  return <InputNumber {...inputNumberProps} />
}

export default PlusMinusInput
