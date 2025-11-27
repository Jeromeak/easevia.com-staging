import { NoResultFoundIcon, TailFinIcon, TailFinLeftIcon } from '@/icons/icon';

export const NoResultFound = () => {
  return (
    <div className="max-w-[90%] mx-auto mt-10 mb-10 dark:mb-0">
      <div className="flex flex-col  justify-center items-center">
        <div className="text-40 uppercase font-Neutra text-neutral-50 dark:text-white">No results found!</div>
        <div className="pt-30 relative">
          <NoResultFoundIcon className="md:w-[550px] md:h-[294px] w-[250px] h-[200px]" />
          <div className="absolute top-20 left-10 md:left-40">
            <TailFinIcon />
          </div>
          <div className="absolute  top-90 left-0 md:left-90">
            <TailFinIcon width="119" height="77" className="transform scale-x-[-1]" />
          </div>
          <div className="absolute  bottom-[-30%] left-30 md:left-40">
            <TailFinLeftIcon width="159" height="84" />
          </div>
        </div>
        <div className="text-[#737373] text-2xl pt-44">Try changing your travel dates and search again.</div>
      </div>
    </div>
  );
};
