import Skeleton from "../Common/Skeleton";

const WEEK_COUNT = 6;
const DAY_COUNT = 7;

export default function CalendarSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="grid grid-cols-7 bg-blue-950 dark:bg-blue-900">
        {Array.from({ length: DAY_COUNT }).map((_, i) => (
          <div key={i} className="flex justify-center py-3">
            <Skeleton className="h-4 w-8 bg-blue-800/60 dark:bg-blue-700/60" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-4">
        {Array.from({ length: WEEK_COUNT * DAY_COUNT }).map((_, i) => (
          <div key={i} className="flex min-h-20 flex-col gap-2 rounded-md border border-gray-200 p-1.5 dark:border-gray-700">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
