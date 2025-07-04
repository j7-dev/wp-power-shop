import { Alert, Button, Form, InputNumber, Select } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { SwitchSize } from 'antd/es/switch'
import { Switch, useEnv } from 'antd-toolkit'
import {
	BOOLEAN_OPTIONS,
	PRODUCT_STOCK_STATUS,
	useWoocommerce,
} from 'antd-toolkit/wp'

const { Item } = Form

export const Stock = ({ id, size }: { id?: string; size?: SizeType }) => {
	const { SITE_URL } = useEnv()
	const { notify_low_stock_amount, manage_stock: canManageStock } =
		useWoocommerce()
	const form = Form.useFormInstance()
	const manageStockName = id ? [id, 'manage_stock'] : ['manage_stock']
	const watchManageStock = Form.useWatch(manageStockName, form)
	const enableStockManagement = watchManageStock === 'yes'

	if (!canManageStock) {
		return (
			<Alert
				message={
					<>
						您的商店未啟用【庫存管理】
						<Button
							color="primary"
							variant="link"
							href={`${SITE_URL}/wp-admin/admin.php?page=wc-settings&tab=products&section=inventory`}
							target="_blank"
							icon={<ExportOutlined />}
							iconPosition="end"
						>
							前往啟用
						</Button>
					</>
				}
				type="info"
				showIcon
				className="mb-4"
			/>
		)
	}

	return (
		<>
			<Item
				name={id ? [id, 'backorders'] : ['backorders']}
				label="允許無庫存下單"
			>
				<Select
					size={size}
					className="w-full"
					options={[
						{ label: '是，且通知顧客', value: 'notify' },
						...BOOLEAN_OPTIONS,
					]}
					allowClear
				/>
			</Item>

			<Switch
				formItemProps={{
					name: id ? [id, 'manage_stock'] : ['manage_stock'],
					label: '管理庫存',
				}}
				switchProps={{
					size: ['small', 'default'].includes(size || 'default')
						? (size as SwitchSize)
						: 'default',
				}}
			/>

			{!enableStockManagement && (
				<Item
					name={id ? [id, 'stock_status'] : ['stock_status']}
					label="庫存狀態"
				>
					<Select
						size={size}
						className="w-full"
						options={PRODUCT_STOCK_STATUS}
						allowClear
					/>
				</Item>
			)}

			{enableStockManagement && (
				<>
					<Item
						name={id ? [id, 'stock_quantity'] : ['stock_quantity']}
						label="庫存數量"
					>
						<InputNumber size={size} className="w-full" />
					</Item>
					<Item
						name={id ? [id, 'low_stock_amount'] : ['low_stock_amount']}
						label="低庫存臨界值"
					>
						<InputNumber
							size={size}
							placeholder={`全店門檻(${notify_low_stock_amount})`}
							className="w-full"
						/>
					</Item>
				</>
			)}
		</>
	)
}
