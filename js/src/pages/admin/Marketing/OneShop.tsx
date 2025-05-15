import React, { useEffect } from 'react'
import { Result, Button } from 'antd'
import { useEnv } from 'antd-toolkit'

export const OneShop = () => {
	const { SITE_URL } = useEnv()
	const LINK = `${SITE_URL}/wp-admin/edit.php?post_type=power-shop`

	useEffect(() => {
		// 新視窗開啟
		window.open(LINK, '_blank')
	}, [])
	return (
		<Result
			icon={
				<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzV4MnJ1dXhjOGV6NHdvcWo2eDQ3N3Buank2OWNrb21hM3QydG0zYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oriO7A7bt1wsEP4cw/giphy.gif" />
			}
			title="全新的一頁賣場即將推出"
			subTitle={
				<>
					一頁賣場是 Power Shop 最早的功能
					<br />
					是用來做 KOL賣場、團購賣場的工具
					<br />
					現在 Power Shop 使用更新更快的 API 以及 UI設計 <br />
					功能即將推出，敬請期待
				</>
			}
			extra={
				<Button type="primary" href={LINK} target="_blank">
					前往舊版一頁賣場
				</Button>
			}
		/>
	)
}
