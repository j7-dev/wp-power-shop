import dayjs from 'dayjs'

import { FORMAT } from '@/pages/admin/Analytics/utils'

import { TQuery } from '../types'

type TTimeSegment = {
	key: 'Dawn' | 'Morning' | 'Afternoon' | 'Evening'
	label: '凌晨' | '上午' | '下午' | '晚上'
	currentHour: number
}

/**
 * 獲取瀏覽器當前小時並分為4等分
 * 只考慮小時(hour)，更加簡潔
 *
 * @return {TTimeSegment} 返回時間段資訊
 *         - 時間段的英文標識 (Dawn/Morning/Afternoon/Evening)
 *       - 時間段的中文名稱 (凌晨/上午/下午/晚上)
 * - 當前小時數 (0-23)
 */
export function getCurrentTimeSegment(): TTimeSegment {
	// 獲取當前小時
	const hour = new Date().getHours()

	// 簡單計算時間段 (0-5為第1段，6-11為第2段，12-17為第3段，18-23為第4段)
	const segment = Math.floor(hour / 6) + 1

	// 時間段名稱
	const segmentData = [
		{
			key: 'Dawn',
			label: '凌晨',
		},
		{
			key: 'Morning',
			label: '上午',
		},
		{
			key: 'Afternoon',
			label: '下午',
		},
		{
			key: 'Evening',
			label: '晚上',
		},
	]

	const currentSegment = segmentData[segment - 1]
	return {
		...currentSegment,
		currentHour: hour,
	} as TTimeSegment
}

/**
 * 獲取當前時間段的問候語
 * @param  display_name 使用者顯示名稱
 * @param  segmentKey   時間段 key
 * @return {string} 問候語
 */
export function getGreetings(
	display_name: string,
	segmentKey: 'Dawn' | 'Morning' | 'Afternoon' | 'Evening'
): string {
	let greetings: string[] = []
	switch (segmentKey) {
		case 'Dawn':
			greetings = [
				`夜深了，${display_name} 早點休息喔！😴`,
				`凌晨時分，${display_name}，你的堅持遠超常人，這就是成功的基石。✨`,
				`熬夜工作的 ${display_name}，你的專注與毅力令人欽佩。👏`,
				`星光下的 ${display_name}，即使在最安靜的時刻，你依然在為夢想奮鬥。🌟`,
				`凌晨好！${display_name}，無論何時開始，重要的是永不放棄。💪`,
				`深夜的努力是最珍貴的投資，${display_name}，你正在創造非凡的未來。🚀`,
				`凌晨的燈火中，${display_name}，你的每一分努力都在為明天鋪路。🔆`,
				`凌晨的寧靜適合思考，${display_name}，你的創意正在這安靜時刻綻放。💭`,
			]
			break
		case 'Morning':
			greetings = [
				`早安，${display_name} 今天又是元氣滿滿的一天！🌞`,
				`早安，${display_name} 新的一天開始了！🌄`,
				`早安，${display_name}！希望今天的工作如陽光般明媚順利。☀️`,
				`清晨的活力屬於你，${display_name}，今天將是高效且富有成就的一天。🌈`,
				`早安！${display_name}，讓我們以飽滿的精神開啟今天的工作計劃。📝`,
				`早安，${display_name}！願今天的工作靈感源源不斷，創意無限。💡`,
				`開啟嶄新的一天，${display_name}，你的每一份努力都將綻放光彩。✨`,
				`早安！${display_name}，讓我們一步步實現工作目標。🎯`,
				`美好的早晨，${display_name}，願你的工作效率如日出般穩步上升。📈`,
			]
			break
		case 'Afternoon':
			greetings = [
				`下午安，${display_name}！希望你的工作進展順利，繼續保持良好狀態。👍`,
				`午後時光，${display_name}，即使疲憊也不忘初心，你的堅持令人敬佩。🌻`,
				`下午安！${display_name}，別忘了工作之餘給自己一個小小的獎勵。🎁`,
				`陽光正好，${display_name}，希望你的工作也像陽光一樣充滿活力。☀️`,
				`下午安，${display_name}！半天已過，但你的熱情依然不減，真是厲害！💯`,
				`午後的 ${display_name}，你處理問題的能力總是如此出色，值得讚賞。👏`,
				`下午安！${display_name}，願下半天的工作如行雲流水般順暢。🌊`,
				`陽光漸斜，${display_name} 的工作熱情卻絲毫不減，繼續加油！🔥`,
				`下午時分，${display_name}，調整好節奏，讓工作更有效率。⏱️`,
				`美好的下午，${display_name}！距離目標越來越近，再接再厲。🏁`,
			]
			break
		default:
			greetings = [
				`晚安，${display_name} 願今晚的時光帶給你新的靈感與思路。💫`,
				`晚安，${display_name}！今日的努力將成為明日的收穫。🌙`,
				`夜晚的星空，是夢想的舞台。${display_name}，願你今晚的夢想成真。✨`,
				`嘿，${display_name}，即使是夜晚，你的堅持也閃閃發光。🌟`,
				`晚安，${display_name}！工作的路上有你真好，繼續加油！👊`,
				`今晚的時光屬於你，${display_name}，每一分鐘都值得珍惜。⏰`,
				`晚安，${display_name}，你的專注與熱情令人欽佩。🔥`,
				`夜色中的 ${display_name}，你的每一步努力都在鋪就成功的道路。🛤️`,
				`傍晚的陽光雖已散去，但 ${display_name} 的熱情依然不減，真棒！👏`,
			]
	}

	// 從 array 中隨機選擇一個
	return greetings[Math.floor(Math.random() * greetings.length)]
}

export function getLabels(query: TQuery) {
	let compareLabel = ''
	switch (query.compare_type) {
		case 'day':
			compareLabel = '相比昨天'
			break
		case 'week':
			compareLabel = '相比上週'
			break
		case 'month':
			compareLabel = '相比上月'
			break
		case 'year':
			compareLabel = '相比去年'
			break
		default:
			compareLabel = '相比去年'
	}

	const before = dayjs(query.before, FORMAT)
	const after = dayjs(query.after, FORMAT)
	const startOfDay = dayjs().startOf('day')

	let label = ''
	if (before.isSame(startOfDay, 'day') && after.isSame(startOfDay, 'day')) {
		label = '今日'
	}

	return {
		label,
		compareLabel,
	}
}

export function getLeaderBoardLabels(type: 'products' | 'customers') {
	switch (type) {
		case 'products':
			return {
				title: '商品熱銷',
				nameLabel: '商品名稱',
				countLabel: '銷售數量',
				totalLabel: '總金額',
			}
		default:
			return {
				title: '顧客消費',
				nameLabel: '顧客姓名',
				countLabel: '訂單數量',
				totalLabel: '總金額',
			}
	}
}
