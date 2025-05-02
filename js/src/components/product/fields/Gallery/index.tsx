import { Image, Form } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import {
	modalPropsAtom,
	selectedItemsAtom,
	selectButtonPropsAtom,
	limitAtom,
} from '@/components/general/MediaLibraryModal/atoms'
import { useSetAtom, getDefaultStore } from 'jotai'
import { defaultImage, cn } from 'antd-toolkit'
import { TImage } from 'antd-toolkit/wp'

const { Item } = Form

export const Gallery = ({ id, size }: { id?: string; size?: SizeType }) => {
	const imageName = id ? [id, 'images'] : ['images']
	const setModalProps = useSetAtom(modalPropsAtom)
	const setSelectButtonProps = useSetAtom(selectButtonPropsAtom)
	const setLimit = useSetAtom(limitAtom)

	const form = Form.useFormInstance()
	const watchImages: TImage[] = Form.useWatch(imageName, form)
	const defaultStore = getDefaultStore()

	/** 按下[選擇檔案]按鈕後，要把值 set 到 form 裡 */
	const handleSetFormValue = () => {
		const selectedItemsStore = defaultStore.get(selectedItemsAtom)
		form.setFieldValue(imageName, [
			...watchImages,
			...selectedItemsStore.map(({ id, url }) => ({ id, url })),
		])
	}

	/** 開啟媒體庫 Modal */
	const handleOpenModal = () => {
		setModalProps((prev) => ({
			...prev,
			open: true,
		}))

		setSelectButtonProps((prev) => ({
			...prev,
			onClick: handleSetFormValue,
		}))

		setLimit(10)
	}

	/** 移除 form 圖片 */
	const handleRemove = (id: string) => () => {
		form.setFieldValue(
			imageName,
			watchImages.filter(({ id: imageId }) => imageId !== id),
		)
	}

	/** 設定封面 */
	const handleSetThumbnail = (targetId: string) => () => {
		// 移動到第一個
		const resortImages: TImage[] = watchImages.reduce((acc, image) => {
			if (image.id === targetId) {
				acc.unshift(image)
			} else {
				acc.push(image)
			}
			return acc
		}, [] as TImage[])

		form.setFieldValue(imageName, resortImages)
	}
	return (
		<div className="mb-6">
			<label className="text-sm font-normal inline-block pb-2">商品圖片</label>
			<Item name={imageName} hidden />
			<div className="grid grid-cols-5 gap-2">
				{watchImages?.map(({ id, url }, index) => (
					<Image
						key={`${id}-${nanoid(4)}`}
						className="product-image aspect-square rounded-lg object-cover w-full h-full"
						preview={{
							mask: (
								<div className="flex flex-col items-center justify-center">
									<div>
										<EyeOutlined />
										<DeleteOutlined
											className="text-red-300 ml-2"
											onClick={handleRemove(id)}
										/>
									</div>
									<p className="m-0 text-xs" onClick={handleSetThumbnail(id)}>
										{index === 0 ? '封面' : '設為封面'}
									</p>
								</div>
							),
							maskClassName: 'rounded-lg',
						}}
						src={url || defaultImage}
						fallback={defaultImage}
					/>
				))}

				<div
					className={cn(
						'group aspect-square rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 border-dashed border-2 border-gray-200 hover:border-blue-200 transition-all duration-300 flex justify-center items-center',
						watchImages?.length === 0 ? 'w-20 h-20' : 'w-full h-full',
					)}
					onClick={handleOpenModal}
				>
					<PlusOutlined className="text-gray-500 group-hover:text-blue-500 transition-all duration-300" />
				</div>
			</div>
		</div>
	)
}
