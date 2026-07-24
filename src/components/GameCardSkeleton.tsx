export function GameCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse h-full flex flex-col">
      <div className="aspect-[16/9] w-full bg-secondary/50" />
      <div className="p-4 flex-1 flex flex-col gap-3 -mt-6 z-10">
        <div className="h-6 bg-secondary/50 rounded w-3/4 mt-4" />
        <div className="flex items-center justify-between mt-1">
          <div className="h-4 bg-secondary/50 rounded w-20" />
          <div className="h-5 bg-secondary/50 rounded w-12" />
        </div>
      </div>
    </div>
  );
}