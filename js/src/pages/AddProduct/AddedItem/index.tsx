/* eslint-disable no-undef */
import { useRef } from 'react'
import Simple from './Simple'
import Variable from './Variable'
import { TProduct } from '@/types/wcRestApi'
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'

const style = {
  marginBottom: '.5rem',
  cursor: 'move',
}

type DragItem = {
  index: number
  id: string
  type: string
}

const ItemTypes = {
  CARD: 'card',
}

const AddedItem: React.FC<{
  product: TProduct
  index: number
  moveCard: (_dragIndex: number, _hoverIndex: number) => void
}> = ({ product, index, moveCard }) => {
  const id = product?.id ?? 0
  const ref = useRef<HTMLDivElement>(null)

  const [
    { handlerId },
    drop,
  ] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves

      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position

      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action

      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.

      item.index = hoverIndex
    },
  })

  const [
    { isDragging },
    drag,
  ] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  const type = product?.type ?? ''

  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {type === 'simple' && <Simple product={product} index={index} />}
      {type === 'variable' && <Variable product={product} index={index} />}
    </div>
  )
}

export default AddedItem
