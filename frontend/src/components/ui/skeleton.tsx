import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-500/50 animate-pulse dark:bg-accent rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
