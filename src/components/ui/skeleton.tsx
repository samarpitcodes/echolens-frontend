import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-surface-muted via-border to-surface-muted bg-[length:200%_100%]",
        className
      )}
      style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
      {...props}
    />
  );
}

export { Skeleton };
