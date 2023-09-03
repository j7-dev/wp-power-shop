import React, { useState, useEffect } from 'react'
import defaultImage from '@/assets/images/defaultImage.jpg'
import { nanoid } from 'nanoid'

const Gallery: React.FC<{ images: string[]; selectedImage?: string }> = ({ images, selectedImage }) => {
  if (images.length === 0) {
    return <img className="aspect-square w-full object-cover" src={defaultImage} />
  }
  const isInclude = images.some((i) => i === selectedImage)

  const [
    selected,
    setSelected,
  ] = useState(images[0])

  const handleClick = (src: string) => () => {
    setSelected(src)
  }

  const mainSrc = images.find((image) => image === selected) ?? ''

  useEffect(() => {
    if (!!selectedImage && isInclude) {
      setSelected(selectedImage)
    } else {
      setSelected(images[0])
    }
  }, [selectedImage])

  return (
    <>
      <img className="aspect-square w-full object-cover" src={mainSrc} />
      {images.length > 1 && (
        <div className="mt-2 w-full grid grid-cols-4 gap-2">
          {images.map((image) => (
            <img key={nanoid()} className={`aspect-square cursor-pointer object-cover w-full ${image === selected && 'border-2 border-blue-500 border-solid'}`} onClick={handleClick(image)} src={image} style={{ width: '-webkit-fill-available' }} />
          ))}
        </div>
      )}
    </>
  )
}

export default Gallery
