export const LeftPannelSkeleton = () => {
  const skeletons = Array(7).fill(null);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="w-[30%] py-2 skeleton rounded-full" />
        <div className="w-[20%] py-2 skeleton rounded-full" />
      </div>
      {skeletons.map((_, index) => (
        <div key={index} className="flex flex-col gap-3 w-full py-5 ">
          <div className="py-3 w-[60%] skeleton rounded-full" />
          <div className="flex justify-between items-center">
            <div className="py-2 w-[50%] skeleton rounded-full" />
            <div className="py-2 w-[20%] skeleton rounded-full" />
          </div>
          <div className="flex justify-between items-center">
            <div className="py-2 w-[60%] skeleton rounded-full" />
            <div className="py-2 w-[30%] skeleton rounded-full" />
          </div>
          <div className="flex justify-between items-center">
            <div className="py-2 w-[70%] skeleton rounded-full" />
            <div className="py-2 w-[25%] skeleton rounded-full" />
          </div>
          <div className="border-b border-b-[#ffffff4d] mt-2 skeleton" />
        </div>
      ))}
    </div>
  );
};
