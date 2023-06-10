import { TProduct } from '@/types/wcRestApi'
import defaultImage from '@/assets/images/defaultImage.jpg'

export const getProductImageSrc = (product: TProduct) => {
  const images = product?.images ?? []
  const image = images[0] ?? {}
  const imageSrc = image?.src ?? defaultImage
  return imageSrc
}
