export const PlanCardSkeleton = () => {
  return (
    <div className="flex bg-white dark:bg-gray-300 justify-between items-start border border-gray-150 dark:border-Light p-12.5 gap-20 rounded-2xl">
      <div className="w-[calc(33.33%_-_80px)] flex gap-3 flex-col">
        <div className="skeleton py-2 rounded-full w-full" />
        <div className="skeleton py-2 rounded-full w-[50%]" />
        <div className="skeleton py-2 rounded-full w-[90%]" />
        <div className="skeleton py-2 rounded-full w-[70%]" />
        <div className="skeleton py-2 rounded-full w-[60%]" />
        <div className="skeleton py-2 rounded-full w-[80%]" />
      </div>
      <div className="w-[calc(33.33%_-_80px)] flex gap-3 flex-col">
        <div className="skeleton py-2 rounded-full w-full" />
        <div className="skeleton py-2 rounded-full w-[50%]" />
        <div className="skeleton py-2 rounded-full w-[90%]" />
        <div className="skeleton py-2 rounded-full w-[70%]" />
        <div className="skeleton py-2 rounded-full w-[60%]" />
        <div className="skeleton py-2 rounded-full w-[80%]" />
      </div>
      <div className="w-[calc(33.33%_-_80px)] flex gap-3 flex-col">
        <div className="skeleton py-2 rounded-full w-full" />
        <div className="skeleton py-2 rounded-full w-[50%]" />
        <div className="skeleton py-2 rounded-full w-[90%]" />
        <div className="skeleton py-2 rounded-full w-[70%]" />
        <div className="skeleton py-2 rounded-full w-[60%]" />
        <div className="skeleton py-2 rounded-full w-[80%]" />
      </div>
    </div>
  );
};
