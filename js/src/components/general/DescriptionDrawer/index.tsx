import { FC, useEffect, lazy, Suspense, memo } from 'react'
import { Button, Form, Drawer, Input, Alert, Radio } from 'antd'
import { LoadingOutlined, ExportOutlined } from '@ant-design/icons'
import { useEditorDrawer } from './hooks'
import { useApiUrl } from '@refinedev/core'
import { useBlockNote } from '@/components/general'
import { useEnv } from 'antd-toolkit'

const { Item } = Form

const BlockNote = lazy(() =>
	import('@/components/general').then((module) => ({
		default: module.BlockNote,
	})),
)

type TDescriptionDrawerProps = {
	name?: string | string[]
}
const DescriptionDrawerComponent: FC<TDescriptionDrawerProps | undefined> = (
	props,
) => {
	const name = props?.name || ['description']
	const { NONCE, SITE_URL, ELEMENTOR_ENABLED } = useEnv()
	const apiUrl = useApiUrl()
	const form = Form.useFormInstance()
	const watchId = Form.useWatch(['id'], form)
	const watchEditor = Form.useWatch(['editor'], form)

	const { blockNoteViewProps, html, setHTML } = useBlockNote({
		apiConfig: {
			apiEndpoint: `${apiUrl}/upload`,
			headers: new Headers({
				'X-WP-Nonce': NONCE,
			}),
		},
	})

	const { editor } = blockNoteViewProps

	const { drawerProps, show, close, open } = useEditorDrawer()

	const handleConfirm = () => {
		form.setFieldValue(name, html)
		close()
	}

	useEffect(() => {
		if (watchId && open) {
			const description = form.getFieldValue(name)

			async function loadInitialHTML() {
				const blocks = await editor.tryParseHTMLToBlocks(description)
				editor.replaceBlocks(editor.document, blocks)
			}
			loadInitialHTML()
		}

		if (!watchId && open) {
			setHTML('')
			editor.removeBlocks(editor.document)
		}
	}, [watchId, open])

	return (
		<div>
			<Item
				name={['editor']}
				label="編輯內容"
				tooltip={getTooltipTitle(ELEMENTOR_ENABLED)}
				className="mb-2"
			>
				<Radio.Group
					options={[
						{
							label: '使用 Power 編輯器',
							value: 'power-editor',
						},
						{
							label: '使用 Elementor 編輯器',
							value: 'elementor',
							disabled: !ELEMENTOR_ENABLED,
						},
					]}
					defaultValue="power-editor"
					optionType="button"
					buttonStyle="solid"
				/>
			</Item>

			<Button
				className="w-[20rem]"
				icon={<ExportOutlined />}
				iconPosition="end"
				onClick={() => {
					if ('power-editor' === watchEditor) {
						show()
						return
					}

					if ('elementor' === watchEditor) {
						window.open(
							`${SITE_URL}/wp-admin/post.php?post=${watchId}&action=elementor`,
							'_blank',
						)
					}
				}}
				color="primary"
				variant="filled"
			>
				開始編輯
			</Button>

			<Item name={name} label={`完整介紹`} hidden>
				<Input.TextArea rows={8} disabled />
			</Item>
			<Drawer
				{...drawerProps}
				extra={
					<div className="flex gap-x-4">
						<Button
							type="default"
							danger
							onClick={() => {
								setHTML('')
								editor.removeBlocks(editor.document)
							}}
						>
							一鍵清空內容
						</Button>
						<Button type="primary" onClick={handleConfirm}>
							確認變更
						</Button>
					</div>
				}
			>
				<Alert
					className="mb-4"
					message="注意事項"
					description={
						<ol className="pl-4">
							<li>
								確認變更只是確認內文有沒有變更，您還是需要儲存才會存進資料庫
							</li>
							<li>可以使用 WordPress shortcode</li>
							{/* <li>圖片在前台顯示皆為 100% ，縮小圖片並不影響前台顯示</li> */}
							<li>未來有新功能持續擴充</li>
						</ol>
					}
					type="warning"
					showIcon
					closable
				/>
				<Suspense
					fallback={
						<Button type="text" icon={<LoadingOutlined />}>
							Loading...
						</Button>
					}
				>
					<BlockNote {...blockNoteViewProps} />
				</Suspense>
			</Drawer>
		</div>
	)
}

function getTooltipTitle(canElementor: boolean) {
	if (canElementor) {
		return ''
	}
	return '您必須安裝並啟用 Elementor 外掛才可以使用 Elementor 編輯'
}

export const DescriptionDrawer = memo(DescriptionDrawerComponent)
