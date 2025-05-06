import { Image, Form } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { PlusOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import { MediaLibraryModal } from '@/components/general'
import { useApiUrlMediaLibraryModal } from '@/components/general/MediaLibraryModal/hooks'
import { defaultImage, cn } from 'antd-toolkit'
import { TImage } from 'antd-toolkit/wp'

const { Item } = Form

export const Gallery = ({ id, size }: { id?: string; size?: SizeType }) => {
	const imageName = id ? [id, 'images'] : ['images']
	const { open, close, modalProps, ...mediaLibraryProps } =
		useApiUrlMediaLibraryModal({ name: imageName, limit: 10 })

	const form = Form.useFormInstance()
	const watchImages: TImage[] = Form.useWatch(imageName, form)

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
										<CloseOutlined
											className="ml-2"
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
					onClick={open}
				>
					<PlusOutlined className="text-gray-500 group-hover:text-blue-500 transition-all duration-300" />
				</div>
			</div>
			<MediaLibraryModal
				initialIds={watchImages?.map(({ id }) => id)}
				modalProps={modalProps}
				mediaLibraryProps={mediaLibraryProps}
			/>
		</div>
	)
}
