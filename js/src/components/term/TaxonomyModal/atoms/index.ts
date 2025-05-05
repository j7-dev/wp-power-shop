import {  ModalProps} from 'antd'
import { atom, } from 'jotai'


const DEFAULT_MODAL_PROPS:ModalProps = {
	title: '媒體庫',
	width: 1600,
	footer: null,
	centered: true,
	zIndex: 2000,
	className: 'pc-media-library',
	open: true
}

/** 控制媒體庫 modal 的 props */
export const modalPropsAtom = atom<ModalProps>(DEFAULT_MODAL_PROPS)
