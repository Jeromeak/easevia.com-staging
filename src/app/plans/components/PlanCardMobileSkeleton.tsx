export const PlanCardMobileSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-300 border border-gray-150 dark:border-Light rounded-2xl p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
        <div className="skeleton h-6 w-32 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-4/5 rounded-full" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="skeleton h-12 w-20 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-4 w-40 rounded-full" />
        <div className="flex flex-col gap-4 mt-4">
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="skeleton w-5 h-5 rounded" />
          <div className="skeleton h-4 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};
