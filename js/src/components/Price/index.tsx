import React from 'react'
import { getCurrencyString } from '@/utils'

const Price: React.FC<{
	salePrice: number | string | undefined
	regularPrice: number | string | undefined
}> = ({ salePrice, regularPrice }) => {
	return salePrice ? (
		<div>
			<p className="mb-0">
				<del>{getCurrencyString({ price: regularPrice })}</del>
			</p>
			<p className="mb-0 text-red-500">
				{getCurrencyString({ price: salePrice })}
			</p>
		</div>
	) : (
		<div>
			<p className="mb-0">{getCurrencyString({ price: regularPrice })}</p>
		</div>
	)
}

export default Price
