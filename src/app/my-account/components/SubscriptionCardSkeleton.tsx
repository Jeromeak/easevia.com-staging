export const SubscriptionCardSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-blue-150 dark:bg-gray-300 rounded-2xl p-5 md:p-8 animate-pulse">
      <div className="flex w-full justify-between items-center pb-4 md:pb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="p-[5px] md:p-[8px] bg-gray-600 rounded-lg w-12 h-12"></div>
            <div className="bg-gray-600 h-8 w-32 rounded"></div>
          </div>
          <div className="bg-gray-600 h-4 w-24 mt-2 rounded"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-gray-600 h-4 w-20 rounded"></div>
          <div className="flex gap-3 items-center">
            <div className="bg-gray-600 h-8 w-20 rounded-full"></div>
            <div className="bg-gray-600 h-6 w-6 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

//* Wrapper component to render multiple skeletons
export const SubscriptionSkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SubscriptionCardSkeleton key={index} />
      ))}
    </div>
  );
};
