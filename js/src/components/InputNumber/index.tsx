import { useState } from 'react'
import { InputNumber as AntdInputNumber } from 'antd'
import './style.scss'

const InputNumber = () => {
  const defaultValue = 1
  const [
    value,
    setValue,
  ] = useState(defaultValue)

  const handleMinus = () => {
    if (value > 0) {
      setValue((pre) => pre - 1)
    }
  }

  const handlePlus = () => {
    setValue((pre) => pre + 1)
  }

  return (
    <AntdInputNumber
      className="w-full"
      addonBefore={
        <span className="fs-addon" onClick={handleMinus}>
          -
        </span>
      }
      addonAfter={
        <span className="fs-addon" onClick={handlePlus}>
          +
        </span>
      }
      defaultValue={defaultValue}
      value={value}
    />
  )
}

export default InputNumber
