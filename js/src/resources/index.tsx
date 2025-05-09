import {
	RadarChartOutlined,
	LineChartOutlined,
	ProductOutlined,
	SettingOutlined,
	UserOutlined,
	MailOutlined,
	TagsOutlined,
} from '@ant-design/icons'
import { FaPhotoVideo } from 'react-icons/fa'
import { ResourceProps } from '@refinedev/core'
import { LiaClipboardListSolid } from 'react-icons/lia'
import { BsBox2 } from 'react-icons/bs'

export const resources: ResourceProps[] = [
	{
		name: 'dashboard',
		list: '/dashboard',
		meta: {
			label: '總覽',
			icon: <RadarChartOutlined />,
		},
	},
	{
		name: 'order-management',
		meta: {
			label: '訂單',
			icon: <LiaClipboardListSolid />,
		},
	},
	{
		parentName: 'order-management',
		name: 'orders',
		list: '/orders',
		edit: '/orders/edit/:id',
		meta: {
			label: '訂單管理',
		},
	},
	{
		parentName: 'order-management',
		name: 'subscriptions',
		list: '/subscriptions',
		edit: '/subscriptions/edit/:id',
		meta: {
			label: '訂閱管理',
		},
	},

	{
		name: 'product-management',
		meta: {
			label: '商品',
			icon: <ProductOutlined />,
		},
	},
	{
		parentName: 'product-management',
		name: 'products',
		list: '/products',
		edit: '/products/edit/:id',
		meta: {
			label: '商品列表',
		},
	},
	{
		parentName: 'product-management',
		name: 'taxonomies',
		list: '/products/taxonomies',
		meta: {
			label: '商品分類',
		},
	},
	{
		parentName: 'product-management',
		name: 'attributes',
		list: '/products/attributes',
		meta: {
			label: '商品規格',
		},
	},
	{
		name: 'users',
		list: '/users',
		edit: '/users/edit/:id',
		meta: {
			label: '顧客',
			icon: <UserOutlined />,
		},
	},
	{
		name: 'marketing',
		meta: {
			label: '行銷',
			icon: <TagsOutlined />,
		},
	},
	{
		parentName: 'marketing',
		name: 'coupons',
		list: '/coupons',
		edit: '/coupons/edit/:id',
		meta: {
			label: '優惠碼',
		},
	},
	{
		parentName: 'marketing',
		name: 'one_shop',
		list: '/one_shop',
		edit: '/one_shop/edit/:id',
		meta: {
			label: '一頁賣場',
		},
	},
	{
		name: 'analytics',
		list: '/analytics',
		meta: {
			label: '數據報表',
			icon: <LineChartOutlined />,
		},
	},
	{
		name: 'emails',
		list: '/emails',
		edit: '/emails/edit/:id',
		meta: {
			label: '通知信',
			icon: <MailOutlined />,
		},
	},
	{
		name: 'settings',
		list: '/settings',
		meta: {
			label: '設定',
			icon: <SettingOutlined />,
		},
	},
	{
		name: 'media-library',
		list: '/media-library',
		meta: {
			label: 'Bunny 媒體庫',
			icon: <FaPhotoVideo />,
		},
	},
	{
		name: 'wp-media-library',
		list: '/wp-media-library',
		meta: {
			label: 'WordPress 媒體庫',
			icon: <FaPhotoVideo />,
		},
	},
	// {
	// 	name: 'shortcodes',
	// 	list: '/shortcodes',
	// 	meta: {
	// 		label: '短代碼',
	// 		icon: <CodeOutlined />,
	// 	},
	// },
]
