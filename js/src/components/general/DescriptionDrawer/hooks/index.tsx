import { useState } from 'react'
import { DrawerProps } from 'antd'

/**
 * Editor Drawer
 * 用於 Notion 編輯器，沒有用 Form 包住
 *
 */

type TUseEditorDrawerParams = {
	drawerProps?: DrawerProps
}

export function useEditorDrawer(props?: TUseEditorDrawerParams) {
	const drawerProps = props?.drawerProps || {}
	const [open, setOpen] = useState(false)

	const show = () => {
		setOpen(true)
	}

	const close = () => {
		setOpen(false)
	}

	const mergedDrawerProps: DrawerProps = {
		title: `編輯內容`,
		forceRender: false,
		placement: 'left',
		onClose: close,
		open,
		width: '50%',
		...drawerProps,
	}

	return {
		open,
		setOpen,
		show,
		close,
		drawerProps: mergedDrawerProps,
	}
}
