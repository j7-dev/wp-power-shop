import { TreeData, TreeNode } from '@ant-design/pro-editor'
import { TDocRecord } from '@/pages/admin/Docs/List/types'

/**
 * 將章節 TDocRecord 傳換成 TreeNode<TDocRecord>
 *
 * @param {TDocRecord} post
 * @return {TreeNode<TDocRecord>}
 */

export function postToTreeNode(post: TDocRecord): TreeNode<TDocRecord> {
	const { id, children, ...rest } = post
	return {
		id,
		content: {
			id,
			...rest,
		} as TDocRecord,
		children: children?.map(postToTreeNode) || [],
		showExtra: false,
		collapsed: true, // 預設為折疊
	}
}

/**
 * 將 TreeData<TDocRecord> 轉換成 Create API 傳送的參數
 * 只抓出順序、parent_id、id
 *
 * @param {TreeData<TDocRecord>} treeData
 * @return {TParam[]}
 */

export type TParam = {
	id: string
	depth: number
	menu_order: number
	parent_id?: string
	name?: string
}

/**
 * 將 TreeData<TDocRecord> 轉換成 Create API 傳送的參數
 * 攤平 array
 *
 * @param {TreeData<TDocRecord>} treeData 樹狀結構
 * @param {string}               parentId 父節點 id
 * @param {number}               depth    深度
 * @return {TParam[]}
 */
export function treeToParams(
	treeData: TreeData<TDocRecord>,
	parentId: string,
	depth: number = 0,
): TParam[] {
	function getFlatArray(
		_treeData: TreeData<TDocRecord>,
		_parentId: string,
		_depth: number = 0,
	): TParam[] {
		const flatArray = _treeData.reduce((acc, node, index) => {
			acc.push({
				id: node.id as string,
				depth: _depth,
				menu_order: index,
				name: node?.content?.name,
				parent_id: _parentId,
			})

			const hasChildren = !!node?.children?.length

			if (hasChildren) {
				const children = node?.children || []
				const childrenFlatArray = getFlatArray(
					children,
					node.id as string,
					_depth + 1,
				)
				acc.push(...childrenFlatArray)
			}

			return acc
		}, [] as TParam[])

		return flatArray
	}

	return getFlatArray(treeData, parentId, depth)
}
