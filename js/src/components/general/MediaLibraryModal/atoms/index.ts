import {  ModalProps, UploadFile, ButtonProps } from 'antd'
import { atom, } from 'jotai'
import { TAttachment } from 'antd-toolkit/wp'

const DEFAULT_MODAL_PROPS:ModalProps = {
	title: '媒體庫',
	width: 1600,
	footer: null,
	centered: true,
	zIndex: 2000,
	className: 'pc-media-library',
}

/** 控制媒體庫 modal 的 props */
export const modalPropsAtom = atom<ModalProps>(DEFAULT_MODAL_PROPS)

/** 已選取的附件 */
export const selectedItemsAtom = atom<TAttachment[]>([])

/** 限制選取的附件數量 */
export const limitAtom = atom<number>(1)

/** 上傳檔案佇列 */
export const filesInQueueAtom = atom<UploadFile[]>([])

/** 選取按鈕的 props */
export const selectButtonPropsAtom = atom<ButtonProps>({})
