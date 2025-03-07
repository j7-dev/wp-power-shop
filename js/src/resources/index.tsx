import {
	RadarChartOutlined,
	TableOutlined,
	LineChartOutlined,
	ProductOutlined,
	SettingOutlined,
	UserOutlined,
	MailOutlined,
	TagsOutlined,
} from '@ant-design/icons'
import { FaPhotoVideo } from 'react-icons/fa'
import { PiStudent } from 'react-icons/pi'
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
		name: 'product_cat',
		list: '/product_cat',
		edit: '/product_cat/edit/:id',
		meta: {
			label: '商品分類',
		},
	},
	{
		name: 'stock',
		list: '/stock',
		edit: '/stock/edit/:id',
		meta: {
			label: '庫存',
			icon: <BsBox2 />,
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
		name: 'posts',
		list: '/posts',
		edit: '/posts/edit/:id',
		meta: {
			label: '文章列表',
			hide: true,
		},
	},
	{
		name: 'docs',
		list: '/docs',
		edit: '/docs/edit/:id',
		meta: {
			label: '知識庫列表',
			icon: <TableOutlined />,
		},
	},
	{
		name: 'users',
		list: '/users',
		meta: {
			label: '學員管理',
			icon: <PiStudent />,
		},
	},
	{
		name: 'doc-access',
		list: '/doc-access',
		meta: {
			label: '知識庫權限綁定',
			icon: <ProductOutlined />,
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
	// {
	// 	name: 'shortcodes',
	// 	list: '/shortcodes',
	// 	meta: {
	// 		label: '短代碼',
	// 		icon: <CodeOutlined />,
	// 	},
	// },
]
