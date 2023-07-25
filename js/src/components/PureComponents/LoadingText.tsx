export const LoadingText: React.FC<{
  height?: string
  width?: string
  isLoading?: boolean
  content?: string
}> = ({
  height = 'h-[1rem]',
  width = 'w-[8rem]',
  isLoading = true,
  content = '',
}) => {
  return isLoading ? (
    <div
      className={`${height} ${width} bg-slate-500 animate-pulse rounded-sm relative inline-block top-[2px]`}
    ></div>
  ) : (
    content
  )
}
