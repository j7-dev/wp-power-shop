import React from 'react'
import { Amount } from 'antd-toolkit'
import { round } from 'lodash-es'

type TPriceProps = {
	amount: number
	currency?: string
	symbol?: boolean
	precision?: number
}
const CURRENCY = 'TWD'

export const Price = ({
	amount,
	currency = CURRENCY,
	symbol = true,
	precision = 0,
}: TPriceProps) => {
	const roundedAmount = round(amount, precision)

	return <Amount amount={roundedAmount} currency={currency} symbol={symbol} />
}
