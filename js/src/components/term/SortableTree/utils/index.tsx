import { TreeData, TreeNode } from '@ant-design/pro-editor'
import { TTerm } from '@/components/term/types'
import { PaginationProps } from 'antd'

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
 * @param {PaginationProps} paginationProps 分頁參數，用來計算分頁的 order 值，只有最上層需要加上 pageSize
 * @param {string}               parentId 父節點 id
 * @param {number}               depth    深度
 * @return {TParam[]}
 */
export function treeToParams(
	treeData: TreeData<TTerm>,
	paginationProps: PaginationProps,
	parentId: string = '0',
	depth: number = 0,
): TParam[] {
	function getFlatArray(
		_treeData: TreeData<TTerm>,
		_paginationProps: PaginationProps,
		_parentId: string,
		_depth: number = 0,
	): TParam[] {
		const flatArray = _treeData.reduce((acc, node, index) => {
			const { pageSize = 20, current = 1 } = _paginationProps
			acc.push({
				id: node.id as string,
				depth: _depth,
				// 只有最上層需要考慮 pageSize
				order: (current - 1) * pageSize * (_depth === 0 ? 1 : 0) + index,
				name: node?.content?.name,
				parent: _parentId,
			})

			const hasChildren = !!node?.children?.length

			if (hasChildren) {
				const children = node?.children || []
				const childrenFlatArray = getFlatArray(
					children,
					_paginationProps,
					node.id as string,
					_depth + 1,
				)
				acc.push(...childrenFlatArray)
			}

			return acc
		}, [] as TParam[])

		return flatArray
	}

	return getFlatArray(treeData, paginationProps, parentId, depth)
}
