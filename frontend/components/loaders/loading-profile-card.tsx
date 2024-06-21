import { Skeleton } from "../ui/skeleton";

export default function LoadingProfileCard() {
  return (
    <div className="pb-6 flex items-start sm:items-center flex-col sm:flex-row gap-4 sm:gap-6">
      <div className="size-[112px]">
        <Skeleton className="size-full rounded-full" />
      </div>
      <div className="flex flex-col h-full flex-1">
        <Skeleton className="h-4 w-[calc(100%-20%)] rounded-full" />

        <div className="flex items-center gap-1.5 mt-2">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="size-4 rounded-full" />
        </div>

        <div className="flex items-center w-full pt-2 mt-2 gap-3">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
