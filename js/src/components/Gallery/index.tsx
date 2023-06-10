import { TImage } from '@/types/wcStoreApi'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'

const Gallery: React.FC<{ images: TImage[] }> = ({ images }) => {
  if (images.length === 0) return null

  const [
    mainSrc,
    setMainSrc,
  ] = useState(images[0].src)

  return (
    <>
      <img className="aspect-square w-full object-cover" src={mainSrc} />
      {images.length > 1 && (
        <div className="mt-2 w-full overflow-auto h-16 flex flex-nowrap">
          {images.map((image) => (
            <img
              key={nanoid()}
              className="aspect-square w-16 mr-2 cursor-pointer object-cover"
              onClick={() => setMainSrc(image.src)}
              src={image.src}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Gallery
