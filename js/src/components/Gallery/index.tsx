import React, { useState, useEffect } from 'react'
import { TImage } from '@/types/wcStoreApi'

const Gallery: React.FC<{ images: TImage[]; selectedImageId?: number }> = ({
  images,
  selectedImageId,
}) => {
  if (images.length === 0) return null

  const [
    selected,
    setSelected,
  ] = useState(images[0].id)

  const handleClick = (id: number) => () => {
    setSelected(id)
  }

  const mainSrc = images.find((image) => image.id === selected)?.src ?? ''

  useEffect(() => {
    if (!!selectedImageId) {
      setSelected(selectedImageId)
    }
  }, [selectedImageId])

  return (
    <>
      <img className="aspect-square w-full object-cover" src={mainSrc} />
      {images.length > 1 && (
        <div className="mt-2 w-full overflow-auto h-16 flex flex-nowrap">
          {images.map((image) => (
            <img
              key={image.id}
              className={`aspect-square w-16 mr-2 cursor-pointer object-cover  ${
                image.id === selected && 'border-2 border-blue-500 border-solid'
              }`}
              onClick={handleClick(image.id)}
              src={image.src}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Gallery
