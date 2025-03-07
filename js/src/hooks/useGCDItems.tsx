import React, { useState, useEffect, FC } from 'react'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { getGCDItems } from 'antd-toolkit'

// TODO
export function useGCDItems<T>({
	allItems,
	key = 'id',
}: {
	allItems: T[][]
	key?: keyof T | string
}) {
	const [selectedGCDs, setSelectedGCDs] = useState<string[]>([])

	// 取得最大公約數的課程
	const gcdItems = getGCDItems<T>(allItems)

	useEffect(() => {
		setSelectedGCDs([])
	}, [allItems.length])

	const GcdItemsTags: FC = () =>
		gcdItems.map((item: T) => {
			const isSelected = selectedGCDs.includes(item?.[key as keyof T] as string)
			return (
				<Tag
					icon={isSelected ? <CheckCircleOutlined /> : undefined}
					color={isSelected ? 'processing' : 'default'}
					key={item?.[key as keyof T] as string}
					className="cursor-pointer"
					onClick={() => {
						if (isSelected) {
							setSelectedGCDs(
								selectedGCDs.filter((id) => id !== item?.[key as keyof T]),
							)
						} else {
							setSelectedGCDs([
								...selectedGCDs,
								item?.[key as keyof T] as string,
							])
						}
					}}
				>
					{/* @ts-expect-error 沒有名字就顯示預設值 */}
					{item?.name || '未知的課程名稱'}
				</Tag>
			)
		})
	return {
		selectedGCDs,
		setSelectedGCDs,
		gcdItems,
		GcdItemsTags,
	}
}
