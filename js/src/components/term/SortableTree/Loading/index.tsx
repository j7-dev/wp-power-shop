import React from 'react'

const Loading = () => {
	return (
		<div className="pl-3">
			{new Array(10).fill(0).map((_, index) => (
				<div
					key={index}
					className=" bg-gray-100 h-7 rounded-sm mb-1 animate-pulse"
				/>
			))}
		</div>
	)
}

export default Loading
