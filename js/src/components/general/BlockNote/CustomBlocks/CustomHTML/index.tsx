import {
	defaultProps,
	insertOrUpdateBlock,
	CustomBlockConfig,
} from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { schema } from '../../useBlockNote'
import { ImEmbed2 } from 'react-icons/im'
import { renderHTML } from 'antd-toolkit'

export const customHTMLMenuItem = (editor: typeof schema.BlockNoteEditor) => ({
	key: 'customHTML',
	title: '自訂 HTML', // 選單中文
	subtext: '支援 HTML、CSS、JavaScript、iframe 等...', // 說明文字
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			type: 'customHTML',
		})
	},
	aliases: ['html'],
	group: 'Advanced',
	icon: <ImEmbed2 className="w-[1.125rem] h-[1.125rem]" />,
})

const customHTMLBlockConfig: CustomBlockConfig = {
	type: 'customHTML',
	propSchema: {
		html: {
			default: '',
		},
	},
	content: 'none',
}

export const CustomHTML = createReactBlockSpec(customHTMLBlockConfig, {
	render: (props) => {
		const value = props.block.props.html

		// ❗contentRef 有個屬性 name ，如果不能編輯是 ""，可以編輯是 "nodeViewContentRef"
		const editable = !(props.contentRef.name === '')

		if (!editable) {
			return <>{renderHTML(value)}</>
		}

		return (
			<div
				className={'bn-file-block-content-wrapper w-full'}
				data-editable="1"
				ref={props.contentRef}
			>
				<textarea
					className="w-full rounded-md border-2 border-solid border-gray-200 p-2 whitespace-pre-wrap"
					rows={10}
					onChange={(e) => {
						props.editor.updateBlock(props.block, {
							type: 'customHTML',
							props: { html: e.target.value as any },
						})
					}}
					value={value}
				/>
			</div>
		)
	},

	// ❗parse 是例如，將剪貼簿複製到編輯器時，要怎麼解析 HTML 轉換為 BLOCK
	parse: undefined,

	// ❗toExternalHTML 是例如，將區塊複製到剪貼簿到外部時，會複製的 內容，如果沒有定義就使用 render
	toExternalHTML: (props) => {
		const value = props.block.props.html
		return <div>{value}</div>
	},
})
