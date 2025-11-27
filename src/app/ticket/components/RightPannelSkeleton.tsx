export const RightPannelSkeleton = () => {
  const RightSkeletons = Array(10).fill(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-300 border  flex justify-between items-end rounded-[14px] border-gray-150 dark:border-gray-150 w-full p-6">
        <div className="flex flex-col gap-3 w-[20%]">
          <div className=" skeleton py-5 w-full rounded-[8px]" />
          <div className=" skeleton py-2 w-full rounded-[8px]" />
        </div>
        <div className="w-[20%]">
          <div className=" skeleton py-2 w-full rounded-[8px]" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-300 border gap-10 flex justify-between items-end rounded-[14px] border-gray-150 dark:border-gray-150 w-full p-6 ">
        <div className="w-[calc(33.33%_-_40px)]">
          <div className=" skeleton py-2 w-full rounded-[8px]" />
        </div>
        <div className="w-[calc(33.33%_-_40px)]">
          <div className=" skeleton py-2 w-full rounded-[8px]" />
        </div>
        <div className="w-[calc(33.33%_-_40px)]">
          <div className=" skeleton py-2 w-full rounded-[8px]" />
        </div>
      </div>
      {RightSkeletons.map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-300 border gap-10 flex justify-between items-stretch rounded-[14px] border-gray-150 dark:border-gray-150 w-full p-6 "
        >
          <div className="w-[calc(33.33%_-_40px)]">
            <div className="flex items-stretch w-full gap-3">
              <div className="w-[calc(20%_-_6px)] skeleton p-4 rounded-[8px]" />
              <div className="w-[calc(80%_-_6px)] flex flex-col gap-3">
                <div className=" skeleton py-2 w-full rounded-[8px]" />
                <div className=" skeleton py-2 w-[60%] rounded-[8px]" />
              </div>
            </div>
          </div>
          <div className="w-[calc(33.33%_-_40px)] flex flex-col gap-3">
            <div className=" skeleton py-2 w-full rounded-[8px]" />
            <div className="flex justify-between items-center ">
              <div className=" skeleton py-2 w-[30%] rounded-[8px]" />
              <div className=" skeleton py-2 w-[30%] rounded-[8px]" />
            </div>
          </div>
          <div className="w-[calc(33.33%_-_40px)] flex flex-col justify-end items-end gap-3">
            <div className=" skeleton py-2 w-[60%] rounded-[8px]" />
            <div className=" skeleton py-2 w-full rounded-[8px]" />
          </div>
        </div>
      ))}
    </div>
  );
};
