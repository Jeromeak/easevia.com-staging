const AgreementData = [
  {
    id: 1,
    content: `Thank you for visiting emirates.com (the "Website"). Please read these terms and conditions carefully before you
        start to use the Website. By accessing and using this Website, you indicate that you accept (unconditionally and
        irrevocably) these terms and conditions (the "Agreement"). If you do not agree to these terms and conditions,
        please refrain from using our Website and exit immediately.`,
  },
  {
    id: 2,
    content: `The Website is owned and operated by Emirates, whose principal office is at Emirates Group Headquarters Building, PO Box 686, Dubai, United Arab Emirates. Emirates is a Dubai corporation established by Decree No.2 of 1985 (as amended) of the Government of Dubai.`,
  },
  {
    id: 3,
    content: `You represent and warrant you possess the legal right and ability to enter into this Agreement and to use this Website in accordance with all terms and conditions herein`,
  },
  {
    id: 4,
    content: `You promise to us you are old enough to enter legally binding contracts through this Website and you know you will be responsible for all payments due to us for bookings made by you or another person using your login information.`,
  },
];

export const Agreement = () => {
  return (
    <div className="flex flex-col w-full gap-4 md:gap-8">
      <div className="md:text-32 text-2xl tracking-[1.92px] w-full border-b border-b-neutral-150 dark:border-b-[#525659] text-black dark:text-white pb-3 uppercase md:leading-[44.8px] font-Neutra">
        Agreement between you and Easevia
      </div>
      {AgreementData.map((data) => (
        <p key={data.id} className="md:text-base uppercase text-justify text-sm md:leading-6">
          {data.content}
        </p>
      ))}
    </div>
  );
};
