import dayjs from 'dayjs'
import { DatePickerProps, TimeRangePickerProps } from 'antd'

export const FORMAT = 'YYYY-MM-DDTHH:mm:ss'

export const RANGE_PRESETS: TimeRangePickerProps['presets'] = [
	{
		label: '今天',
		value: [dayjs().startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 7 天',
		value: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 14 天',
		value: [dayjs().add(-14, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 30 天',
		value: [dayjs().add(-30, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 90 天',
		value: [dayjs().add(-90, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 180 天',
		value: [dayjs().add(-180, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 365 天',
		value: [dayjs().add(-365, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '月初至今',
		value: [dayjs().startOf('month'), dayjs().endOf('day')],
	},
	{ label: '年初至今', value: [dayjs().startOf('year'), dayjs().endOf('day')] },
]

// Disabled 732 days from the selected date
export const maxDateRange: DatePickerProps['disabledDate'] = (
	current,
	{ from, type },
) => {
	if (current && current > dayjs().endOf('day')) {
		return true
	}
	if (from) {
		return Math.abs(current.diff(from, 'days')) >= 366
	}

	return false
}
