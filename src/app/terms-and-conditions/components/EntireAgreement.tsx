export const EntireAgreement = () => {
  return (
    <div className="flex flex-col w-full gap-4 md:gap-8">
      <div className="md:text-32 text-2xl tracking-[1.92px] w-full border-b border-b-neutral-150 dark:border-b-[#525659] text-black dark:text-white pb-3 uppercase md:leading-[44.8px] font-Neutra">
        Entire agreement
      </div>

      <p className="md:text-base uppercase text-justify text-sm md:leading-6">
        These terms and conditions and any other legal notices, policies and guidelines of Emirates linked to these
        terms and conditions constitute the entire agreement between you and Emirates relating to your use of this
        Website and supersede any prior understandings or agreements (whether oral or written), claims, representations,
        and understandings of the parties regarding such subject matter and the terms and conditions may not be amended
        or modified except by making such amendments or modifications available on this Website.
      </p>
    </div>
  );
};
