export const AccountInfo = () => {
  return (
    <div className="w-full p-4 md:p-8 dark:bg-gray-300 rounded-[20px] flex flex-col">
      <div className="text-[#ACACAC] text-[18px] md:text-2xl leading-7 tracking-[0.48px]">ACCOUNT INFORMATION</div>
      <div className="w-full md:w-[60%] mt-6 md:mt-8 flex flex-col gap-3">
        <div className="flex items-center">
          <div className="w-1/2 text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base">Email</div>
          <div className="w-1/2 text-neutral-50 dark:text-white text-sm md:text-base break-all">
            00Charlamagne@gmail.com
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/2 text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base">Mobile</div>
          <div className="w-1/2 text-neutral-50 dark:text-white text-sm md:text-base">+1234567890</div>
        </div>
        <div className="flex items-center">
          <div className="w-1/2 text-[#0D0D0D80] dark:text-[#ffffff80] text-sm md:text-base">Attempted</div>
          <div className="w-1/2 text-neutral-50 dark:text-white text-sm md:text-base">7/19/2025</div>
        </div>
      </div>
    </div>
  );
};
