import { TreeData, TreeNode } from '@ant-design/pro-editor'
import { TOrderRecord } from '@/pages/admin/Orders/List/types'

/**
 * 將章節 TOrderRecord 傳換成 TreeNode<TOrderRecord>
 *
 * @param {TOrderRecord} post
 * @return {TreeNode<TOrderRecord>}
 */

export function postToTreeNode(post: TOrderRecord): TreeNode<TOrderRecord> {
	const { id, children, ...rest } = post
	return {
		id,
		content: {
			id,
			...rest,
		} as TOrderRecord,
		children: children?.map(postToTreeNode) || [],
		showExtra: false,
		collapsed: true, // 預設為折疊
	}
}

/**
 * 將 TreeData<TOrderRecord> 轉換成 Create API 傳送的參數
 * 只抓出順序、parent_id、id
 *
 * @param {TreeData<TOrderRecord>} treeData
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
 * 將 TreeData<TOrderRecord> 轉換成 Create API 傳送的參數
 * 攤平 array
 *
 * @param {TreeData<TOrderRecord>} treeData 樹狀結構
 * @param {string}               parentId 父節點 id
 * @param {number}               depth    深度
 * @return {TParam[]}
 */
export function treeToParams(
	treeData: TreeData<TOrderRecord>,
	parentId: string,
	depth: number = 0,
): TParam[] {
	function getFlatArray(
		_treeData: TreeData<TOrderRecord>,
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
