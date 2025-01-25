import { cx } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("bg-background animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
