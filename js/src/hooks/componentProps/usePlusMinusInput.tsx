import { useState } from 'react'
import { InputNumberProps } from 'antd'

export const usePlusMinusInput = (max?: number) => {
	const [
		plusMinusInputProps,
		setPlusMinusInputProps,
	] = useState<InputNumberProps>({
		value: 1,
		defaultValue: 1,
	})

	const MIN = 1
	const MAX = max ?? Infinity

	const handleMinus = () => {
		const value = Number(plusMinusInputProps?.value || 1)
		if (value <= MIN) return
		setPlusMinusInputProps({
			...plusMinusInputProps,
			value: value - 1,
		})
	}

	const handlePlus = () => {
		const value = Number(plusMinusInputProps?.value || 1)
		if (value >= MAX) return
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
			min: MIN,
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
		} as InputNumberProps<number>,
		setPlusMinusInputProps,
	}
}
