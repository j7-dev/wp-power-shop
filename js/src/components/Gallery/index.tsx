import React, { useState, useEffect } from 'react'
import { TImage } from '@/types'

const Gallery: React.FC<{ images: TImage[]; selectedImageId?: number }> = ({
  images,
  selectedImageId,
}) => {
  if (images.length === 0) return null
  const isInclude = images.some((i) => i.id === selectedImageId)

  const [
    selected,
    setSelected,
  ] = useState(images[0].id)

  const handleClick = (id: number) => () => {
    setSelected(id)
  }

  const mainSrc = images.find((image) => image.id === selected)?.src ?? ''

  useEffect(() => {
    if (!!selectedImageId && isInclude) {
      setSelected(selectedImageId)
    } else {
      setSelected(images[0].id)
    }
  }, [selectedImageId])

  useEffect(() => {
    if (images.length > 0) {
      setSelected(images[0].id)
    }
  }, [images])

  return (
    <>
      <img className="aspect-square w-full object-cover" src={mainSrc} />
      {images.length > 1 && (
        <div className="mt-2 w-full grid grid-cols-4 gap-2">
          {images.map((image) => (
            <img
              key={image.id}
              className={`aspect-square cursor-pointer object-cover w-full ${
                image.id === selected && 'border-2 border-blue-500 border-solid'
              }`}
              onClick={handleClick(image.id)}
              src={image.src}
              style={{ width: '-webkit-fill-available' }}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Gallery
