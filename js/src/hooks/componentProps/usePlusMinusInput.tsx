import { useState } from 'react'
import { InputNumberProps } from 'antd'

export const usePlusMinusInput = (
  inputNumberProps: InputNumberProps = {
    value: 1,
    defaultValue: 1,
  },
) => {
  const [
    plusMinusInputProps,
    setPlusMinusInputProps,
  ] = useState<InputNumberProps>(inputNumberProps)

  const handleMinus = () => {
    const value = Number(plusMinusInputProps?.value || 1)
    setPlusMinusInputProps({
      ...plusMinusInputProps,
      value: value - 1,
    })
  }

  const handlePlus = () => {
    const value = Number(plusMinusInputProps?.value || 1)
    setPlusMinusInputProps({
      ...plusMinusInputProps,
      value: value + 1,
    })
  }

  const handleChange = (v: number | null) => {
    if (v) {
      setPlusMinusInputProps({
        ...plusMinusInputProps,
        value: v,
      })
    } else {
      setPlusMinusInputProps({
        ...plusMinusInputProps,
        value: 1,
      })
    }
  }

  return {
    plusMinusInputProps: {
      ...plusMinusInputProps,
      min: 1,
      className: 'w-full',
      addonBefore: (
        <span className="ps-addon" onClick={handleMinus}>
          -
        </span>
      ),
      addonAfter: (
        <span className="ps-addon" onClick={handlePlus}>
          +
        </span>
      ),
      onChange: handleChange,
    },
    setPlusMinusInputProps,
  }
}
