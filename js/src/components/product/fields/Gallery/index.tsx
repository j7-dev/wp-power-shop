import { TFormValues } from '@/components/product/ProductEditTable/types'
import { Image, Form } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { PlusOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import { MediaLibraryModal } from '@/components/general'
import { useApiUrlMediaLibraryModal } from '@/components/general/MediaLibraryModal/hooks'
import { defaultImage, cn } from 'antd-toolkit'
import { TImage } from 'antd-toolkit/wp'

const { Item } = Form

export const Gallery = ({
	id,
	size,
	limit = 10,
	wrapClassName = 'flex flex-wrap gap-2',
	onValuesChange,
}: {
	id?: string
	size?: SizeType
	limit?: number
	wrapClassName?: string
	onValuesChange?: (
		changedValues: {
			[key: string]: Partial<TFormValues>
		},
		allValues: TFormValues[],
	) => void
}) => {
	const imageName = id ? [id, 'images'] : ['images']
	const form = Form.useFormInstance()

	const { open, close, modalProps, ...mediaLibraryProps } =
		useApiUrlMediaLibraryModal({
			limit,
			onConfirm: (selectedItems) => {
				form.setFieldValue(imageName, selectedItems)

				if (onValuesChange && id) {
					const allValues = form.getFieldsValue()
					onValuesChange?.(
						{
							[id]: {
								//@ts-ignore
								images: selectedItems,
							},
						} as {
							[key: string]: Partial<TFormValues>
						},
						allValues,
					)
				}
			},
		})

	const watchImages: TImage[] = Form.useWatch(imageName, form)

	/** 移除 form 圖片 */
	const handleRemove = (_imageId: string) => () => {
		form.setFieldValue(
			imageName,
			watchImages.filter(({ id: imageId }) => imageId !== _imageId),
		)

		if (onValuesChange && id) {
			const allValues = form.getFieldsValue()
			onValuesChange?.(
				{
					[id]: {
						//@ts-ignore
						images: watchImages.filter(
							({ id: imageId }) => imageId !== _imageId,
						),
					},
				} as {
					[key: string]: Partial<TFormValues>
				},
				allValues,
			)
		}
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

	const imgSizeClass = 'small' === size ? 'w-10 h-10' : 'w-20 h-20'

	return (
		<>
			{'small' !== size && (
				<label className="text-sm font-normal inline-block pb-2">
					商品圖片
				</label>
			)}
			<Item name={imageName} hidden />
			<div className={wrapClassName}>
				{watchImages?.map(
					({ id: _imageId, url }, index) =>
						index < limit && (
							<Image
								key={`${_imageId}-${nanoid(4)}`}
								className={cn(
									'product-image aspect-square rounded-lg object-cover',
									imgSizeClass,
								)}
								preview={{
									mask: (
										<div className="flex flex-col items-center justify-center">
											<div>
												<EyeOutlined />
												<CloseOutlined
													className={'small' !== size ? 'ml-2' : 'ml-1'}
													onClick={handleRemove(_imageId)}
												/>
											</div>
											{'small' !== size && (
												<p
													className="m-0 text-xs"
													onClick={handleSetThumbnail(_imageId)}
												>
													{index === 0 ? '封面' : '設為封面'}
												</p>
											)}
										</div>
									),
									maskClassName: 'rounded-lg',
								}}
								src={url || defaultImage}
								fallback={defaultImage}
							/>
						),
				)}
				{watchImages?.length < limit && (
					<div
						className={cn(
							'group aspect-square rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 border-dashed border-2 border-gray-200 hover:border-blue-200 transition-all duration-300 flex justify-center items-center',
							imgSizeClass,
						)}
						onClick={open}
					>
						<PlusOutlined className="text-gray-500 group-hover:text-blue-500 transition-all duration-300" />
					</div>
				)}
			</div>
			<MediaLibraryModal
				initialIds={watchImages?.map(({ id: _imageId }) => _imageId)}
				modalProps={modalProps}
				mediaLibraryProps={mediaLibraryProps}
			/>
		</>
	)
}
