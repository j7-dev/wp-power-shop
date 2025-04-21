import { TreeData, TreeNode } from '@ant-design/pro-editor'
import { TTerm } from '@/components/term/types'

/**
 * 將章節 TTerm 傳換成 TreeNode<TTerm>
 *
 * @param {TTerm} term
 * @return {TreeNode<TTerm>}
 */

export function termToTreeNode(term: TTerm): TreeNode<TTerm> {
	const { id, children, ...rest } = term
	return {
		id,
		content: {
			id,
			...rest,
		} as TTerm,
		children: children?.map(termToTreeNode) || [],
		showExtra: false,
		collapsed: true, // 預設為折疊
	}
}

export type TParam = {
	id: string
	depth: number
	order: number
	parent?: string
	name?: string
}

/**
 * 將 TreeData<TTerm> 轉換成 Create API 傳送的參數
 * 攤平 array
 *
 * @param {TreeData<TTerm>} treeData 樹狀結構
 * @param {string}               parentId 父節點 id
 * @param {number}               depth    深度
 * @return {TParam[]}
 */
export function treeToParams(
	treeData: TreeData<TTerm>,
	parentId: string = '',
	depth: number = 0,
): TParam[] {
	function getFlatArray(
		_treeData: TreeData<TTerm>,
		_parentId: string,
		_depth: number = 0,
	): TParam[] {
		const flatArray = _treeData.reduce((acc, node, index) => {
			acc.push({
				id: node.id as string,
				depth: _depth,
				order: index,
				name: node?.content?.name,
				parent: _parentId,
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
