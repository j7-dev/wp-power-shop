import { Card as AntdCard, CardProps } from 'antd'

const Card = ({
	children,
	showCard = true,
	...props
}: CardProps & { showCard?: boolean }) => {
	return showCard ? <AntdCard {...props}>{children}</AntdCard> : children
}

export default Card
