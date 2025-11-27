import { useMemo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';

export const Banner = () => {
  const sectionClassName = useMemo(() => clsx('pb-16 xl:pb-38 overflow-hidden'), []);
  const relativeClassName = useMemo(() => clsx('relative'), []);
  const fitClassName = useMemo(() => clsx('w-full h-fit'), []);
  const bgBannerClassName = useMemo(() => clsx('bg-banner absolute w-full h-full opacity-[0.3] mix-blend-overlay'), []);
  const textClassName = useMemo(
    () =>
      clsx(
        'absolute md:block hidden xl:right-8 text-white md:right-10 top-1/2 transform -translate-y-1/2 md:leading-[40px] md:text-[40px] xl:text-90 font-Neutra uppercase xl:leading-[90px] tracking-[2.7px] md:w-[40%] 2xl:w-[32%]'
      ),
    []
  );
  const imgClassName = useMemo(() => clsx('w-full h-full'), []);

  return (
    <section className={sectionClassName}>
      <div className={relativeClassName}>
        <div className={fitClassName}>
          <div className={bgBannerClassName} />
          <div className={textClassName}>Enjoy Hassle-Free and Surge-Free Travel with easevia</div>
          <Image
            src={`${cdnBaseUrl}/airport.webp`}
            className={imgClassName}
            alt="airport"
            title="Airport"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </section>
  );
};
