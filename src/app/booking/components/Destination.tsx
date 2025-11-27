'use client';

import clsx from 'clsx';
import { ArrowLeft, DestinationLocation, RightArrow } from '@/icons/icon';
import React, { useState, useCallback, useMemo } from 'react';
import type { PopularProps } from '@/lib/types/common.types';
import Image from 'next/image';
import { cdnBaseUrl } from '@/lib/config';
import { useAuthModal, AuthModalType } from '@/hooks/useAuthModal';

const MapRightIcon = ({ className }: { className?: string }) => <DestinationLocation className={className} />;

export const Destination: React.FC<PopularProps> = ({
  textColor = 'text-teal-400',
  leftBgColor = 'bg-Teal-500',
  arrowColor = 'text-yellow-500',
  arrowBorderColor = 'border-yellow-500',
  widthClass = 'w-[90%]',
  subTitle = 'dark:text-white',
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { openModal } = useAuthModal();

  const handleBookNow = useCallback(() => {
    openModal(AuthModalType.LOGIN);
  }, [openModal]);

  const handleBookNowClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleBookNow();
    },
    [handleBookNow]
  );

  const destinations = useMemo(
    () => [
      { id: 1, name: 'Abu Dhabi', image: `${cdnBaseUrl}/abu.webp`, size: 'large' },
      { id: 2, name: 'Dubai', image: `${cdnBaseUrl}/dubai.webp`, size: 'medium' },
      { id: 3, name: 'Bali', image: `${cdnBaseUrl}/bali.webp`, size: 'medium' },
      {
        id: 4,
        name: 'Switzerland',
        image: `${cdnBaseUrl}/swiss.webp`,
        size: 'medium',
      },
      {
        id: 5,
        name: 'Australia',
        image: `${cdnBaseUrl}/aus.webp`,
        size: 'medium',
      },
    ],
    []
  );

  const slides = useMemo(
    () => [
      [destinations[0], destinations[1], destinations[2]],
      [destinations[1], destinations[2], destinations[3]],
      [destinations[2], destinations[3], destinations[4]],
      [destinations[3], destinations[4], destinations[0]],
      [destinations[4], destinations[0], destinations[1]],
    ],
    [destinations]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="md:pt-10 pb-16 lg:pb-20 dark:lg:pb-38">
      <div className="w-full flex items-center justify-center p-0">
        <div
          className={clsx(
            'w-full h-[60vh] md:h-[80vh] lg:h-[50vh] xl:h-[70vh] bg-white dark:bg-black flex flex-col lg:flex-row'
          )}
        >
          <div
            className={clsx(
              leftBgColor,
              'w-full lg:w-[40%] xl:w-[45%] flex flex-col justify-around px-6 lg:px-12 xl:px-16'
            )}
          >
            <div className="text-left">
              <div
                className={clsx(
                  textColor,
                  'text-5xl md:text-6xl lg:text-7xl xl:text-90 font-medium font-Neutra uppercase'
                )}
              >
                Popular Destination
              </div>
              <p
                className={clsx(
                  'text-base lg:text-lg xl:text-2xl xl:w-[70%] my-3 lg:mt-8 uppercase tracking-widest font-light font-Futra',
                  subTitle
                )}
              >
                Start your Journey with a Single Click
              </p>
            </div>
            <div className="lg:flex hidden gap-4 lg:gap-6">
              <button
                className={clsx(
                  'w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer group',
                  arrowBorderColor
                )}
                onClick={prevSlide}
              >
                <ArrowLeft className={clsx('w-6 h-6 lg:w-7 lg:h-7 transition-colors', arrowColor)} />
              </button>
              <button
                className={clsx(
                  'w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer group',
                  arrowBorderColor
                )}
                onClick={nextSlide}
              >
                <ArrowLeft
                  className={clsx('w-6 h-6 lg:w-7 lg:h-7 transform rotate-180 transition-colors', arrowColor)}
                />
              </button>
            </div>
          </div>
          <div className={clsx('ml-auto  lg:mt-0 flex-1 w-[90%] lg:w-[60%] xl:w-[55%] h-full', widthClass)}>
            <div className="lg:hidden h-full">
              <div className="flex gap-5 h-full">
                {slides[currentSlide].slice(0, 2).map((destination, index) => (
                  <div
                    key={destination.id}
                    className={`relative h-full overflow-hidden group cursor-pointer ${
                      index === 0 ? 'w-[70%]' : 'w-[30%]'
                    }`}
                  >
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      title={destination.name}
                      height={500}
                      width={500}
                      className={clsx(
                        'absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                      )}
                      draggable={true}
                    />
                    <div
                      className={clsx('absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent')}
                    />

                    <div className={clsx('absolute bottom-0 left-0 right-0 p-3 z-10')}>
                      <div className={clsx('text-white')}>
                        <div className={clsx('flex items-center gap-2 mb-2')}>
                          <MapRightIcon className={clsx('w-3 h-3 text-white')} />
                          <div className={clsx('text-xs font-medium')}>{destination.name}</div>
                        </div>
                        {index === 0 && (
                          <button
                            type="button"
                            role="button"
                            onClick={handleBookNowClick}
                            className={clsx(
                              'bg-transparent border border-white hover:bg-white hover:text-black text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300'
                            )}
                          >
                            Book Now <RightArrow className={clsx('w-3 h-3 inline-block ml-1')} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={clsx('hidden lg:flex h-full gap-4')}>
              {slides[currentSlide].map((destination, index) => (
                <div
                  key={destination.id}
                  className={`relative overflow-hidden transition-all duration-500 group cursor-pointer ${
                    index === 0 ? 'w-[50%]' : 'w-[25%]'
                  } h-full`}
                >
                  <div
                    className={clsx(
                      'absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                    )}
                    style={{ backgroundImage: `url(${destination.image})` }}
                  />
                  <div
                    className={clsx('absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent')}
                  />

                  <div className={clsx('absolute bottom-0 left-0 right-0 p-8 z-10')}>
                    {index === 0 ? (
                      <div className={clsx('text-white')}>
                        <div className={clsx('flex items-center gap-3 mb-6')}>
                          <MapRightIcon className={clsx('w-5 h-5 text-white')} />
                          <div className={clsx('text-[32px] font-medium font-Neutra')}>{destination.name}</div>
                        </div>
                        <button
                          type="button"
                          role="button"
                          onClick={handleBookNowClick}
                          className={clsx(
                            'bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-300'
                          )}
                        >
                          Book Now <RightArrow className={clsx('w-5 h-5 inline-block')} />
                        </button>
                      </div>
                    ) : (
                      <div className={clsx('h-full flex items-end justify-center pb-8')}>
                        <div className={clsx('text-white flex flex-col items-center')}>
                          <div
                            className={clsx(
                              'text-white font-Neutra text-[32px] font-medium mb-4 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180'
                            )}
                          >
                            {destination.name}
                          </div>
                          <MapRightIcon className={clsx('w-4 h-4 text-white')} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={clsx(
                      'absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destination;
