import { FC } from 'react'
import { InputNumber, InputNumberProps } from 'antd'
import './style.scss'

const PlusMinusInput: FC<
  InputNumberProps<number> & {
    stockQty?: number | null
  }
> = ({ stockQty, ...inputNumberProps }) => {
  console.log('⭐  stockQty:', stockQty)
  const getProps = (v: number | undefined | null) => {
    if (v === undefined || v === null) return inputNumberProps

    if (v >= 0) {
      return {
        ...inputNumberProps,
        max: v,
      }
    }
    return inputNumberProps
  }
  const props = getProps(stockQty)

  return <InputNumber {...props} />
}

export default PlusMinusInput
