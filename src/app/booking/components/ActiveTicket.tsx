'use client';
import { ArrowLeft } from '@/icons/icon';
import { TicketCard } from './TicketCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { getActiveTickets } from '@/lib/api/booking';
import type { ActiveTicket } from '@/lib/types/api/booking';
import moment from 'moment';

gsap.registerPlugin(ScrollTrigger);

// Helper function to get airline name from carrier code
const getAirlineName = (carrierCode: string): string => {
  const airlineMap: Record<string, string> = {
    AI: 'Air India',
    GR: 'Aurigny Air Services',
    IX: 'Air India Express',
    // Add more mappings as needed
  };

  return airlineMap[carrierCode] || 'Airline';
};

export const ActiveTickets = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  const [activeTickets, setActiveTickets] = useState<ActiveTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Transform API data to TicketData format
  const transformActiveTicketToTicketData = useCallback((ticket: ActiveTicket) => {
    // Handle new API structure with flightOffers
    if ('flightOffers' in ticket.flight_details && Array.isArray(ticket.flight_details.flightOffers)) {
      const firstOffer = ticket.flight_details.flightOffers[0];

      if (!firstOffer || !firstOffer.itineraries || firstOffer.itineraries.length === 0) {
        return null;
      }

      const firstItinerary = firstOffer.itineraries[0];

      if (!firstItinerary.segments || firstItinerary.segments.length === 0) {
        return null;
      }

      const firstSegment = firstItinerary.segments[0];
      const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

      // Calculate total duration from all segments
      const totalDurationMinutes = firstItinerary.segments.reduce((total, segment) => {
        const duration = segment.duration;
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

        if (!match) return total;

        const hours = match[1] ? parseInt(match[1], 10) : 0;
        const minutes = match[2] ? parseInt(match[2], 10) : 0;

        return total + hours * 60 + minutes;
      }, 0);

      const hours = Math.floor(totalDurationMinutes / 60);
      const minutes = totalDurationMinutes % 60;
      const durationStr = hours > 0 && minutes > 0 ? `${hours}h ${minutes}m` : hours > 0 ? `${hours}h` : `${minutes}m`;

      // Get cabin class from traveler pricing
      const cabinClass = firstOffer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY';
      const classType = `${cabinClass.charAt(0) + cabinClass.slice(1).toLowerCase()} Class`;

      // Get airline name from carrier code (fallback to hardcoded if not found)
      const carrierCode = firstSegment.carrierCode;
      const airlineName = getAirlineName(carrierCode);

      return {
        fromCity: ticket.origin || firstSegment.departure.iataCode,
        fromCode: firstSegment.departure.iataCode,
        fromTime: moment(firstSegment.departure.at).format('HH:mm A'),
        toCity: ticket.destination || lastSegment.arrival.iataCode,
        toCode: lastSegment.arrival.iataCode,
        toTime: moment(lastSegment.arrival.at).format('HH:mm A'),
        date: moment(ticket.departure_date_time).format('ddd, DD MMM YY'),
        duration: durationStr,
        seatType: 'Premium',
        classType: classType,
        airline: airlineName,
        logo: airlineName.toLowerCase().replace(/\s+/g, ''),
      };
    }

    // Handle legacy structure (array of flight details)
    if (Array.isArray(ticket.flight_details) && ticket.flight_details.length > 0) {
      const firstFlight = ticket.flight_details[0];

      if (!firstFlight || !('departure' in firstFlight)) {
        return null;
      }

      return {
        fromCity: ticket.origin || firstFlight.departure.iataCode,
        fromCode: firstFlight.departure.iataCode,
        fromTime: moment(firstFlight.departure.at).format('HH:mm A'),
        toCity: ticket.destination || firstFlight.arrival.iataCode,
        toCode: firstFlight.arrival.iataCode,
        toTime: moment(firstFlight.arrival.at).format('HH:mm A'),
        date: moment(ticket.departure_date_time).format('ddd, DD MMM YY'),
        duration: firstFlight.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm'),
        seatType: 'Premium',
        classType: 'Economy Class',
        airline: 'airlineName' in firstFlight ? firstFlight.airlineName : 'Airline',
        logo: 'airlineName' in firstFlight ? firstFlight.airlineName.toLowerCase().replace(/\s+/g, '') : 'airline',
      };
    }

    return null;
  }, []);

  // Fetch active tickets on component mount
  useEffect(() => {
    const fetchActiveTickets = async () => {
      try {
        setLoading(true);
        const tickets = await getActiveTickets();
        setActiveTickets(tickets);
      } catch (error) {
        console.error('Failed to fetch active tickets:', error);
        setActiveTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTickets();
  }, []);

  const ticketSlides = useMemo(() => {
    return activeTickets
      .map((ticket, idx) => {
        const transformedTicket = transformActiveTicketToTicketData(ticket);
        if (!transformedTicket) return null;

        return (
          <SwiperSlide key={ticket.id || idx}>
            <TicketCard {...transformedTicket} />
          </SwiperSlide>
        );
      })
      .filter(Boolean);
  }, [activeTickets, transformActiveTicketToTicketData]);

  const navButtonClass = useMemo(
    () =>
      clsx(
        'nav-button w-14 md:w-20 swiper-button-prev-custom text-orange-450 dark:text-orange-200 cursor-pointer h-14 md:h-20 flex justify-center items-center rounded-full border-[2.571px] border-orange-450 dark:border-orange-200 transition-all duration-300'
      ),
    []
  );
  const navButtonNextClass = useMemo(
    () =>
      clsx(
        'nav-button w-14 md:w-20 swiper-button-next-custom text-orange-450 dark:text-orange-200 cursor-pointer h-14 md:h-20 flex justify-center items-center rounded-full border-[2.571px] border-orange-450 dark:border-orange-200 transition-all duration-300'
      ),
    []
  );

  const setupGsapAnimations = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.nav-button',
        {
          opacity: 0,
          x: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: navigationRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        swiperRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: swiperRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      gsap.utils.toArray('.nav-button').forEach((button) => {
        const buttonElement = button as HTMLElement;
        const hoverTl = gsap.timeline({ paused: true });

        hoverTl.to(buttonElement, {
          scale: 1.1,
          borderColor: '#f97316',
          color: '#f97316',
          duration: 0.3,
          ease: 'power2.out',
        });

        buttonElement.addEventListener('mouseenter', () => hoverTl.play());
        buttonElement.addEventListener('mouseleave', () => hoverTl.reverse());
      });
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      setupGsapAnimations();
    }, sectionRef);

    return () => ctx.revert();
  }, [setupGsapAnimations]);

  return (
    <section ref={sectionRef}>
      <div className="max-w-[90%] mx-auto py-10 lg:py-25 dark:lg:py-30">
        <div className="flex flex-col w-full">
          <div className="w-full md:flex-row flex flex-col justify-between items-center">
            <div className="flex flex-col w-full md:w-auto">
              <div
                ref={titleRef}
                className="text-[43px] leading-[43px] md:text-7xl text-left lg:text-90 font-Neutra  uppercase md:leading-[90px] tracking-wider text-Teal-900 dark:text-Teal-500"
              >
                Active Tickets
              </div>
              <p
                ref={subtitleRef}
                className="text-xs md:text-2xl text-neutral-50 dark:text-white text-left font-normal uppercase tracking-[1.44px] leading-[33.6px]"
              >
                Your upcoming Journey
              </p>
            </div>
            <div ref={navigationRef} className="hidden lg:flex mt-8 md:mt-0 items-center gap-6">
              <div className={navButtonClass}>
                <ArrowLeft />
              </div>
              <div className={navButtonNextClass}>
                <ArrowLeft className="transform rotate-180" />
              </div>
            </div>
          </div>
          <div ref={swiperRef} className="mt-10 md:mt-20">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">Loading your active tickets...</div>
              </div>
            ) : activeTickets.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="text-lg text-gray-600 mb-2">No active tickets found</div>
                  <div className="text-sm text-gray-500">Your upcoming journeys will appear here</div>
                </div>
              </div>
            ) : ticketSlides.length > 0 ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom',
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={ticketSlides.length > 1}
                speed={1000}
                spaceBetween={24}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 1.5 },
                  1200: { slidesPerView: 2.5 },
                }}
              >
                {ticketSlides}
              </Swiper>
            ) : (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="text-lg text-gray-600 mb-2">No active tickets found</div>
                  <div className="text-sm text-gray-500">Your upcoming journeys will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
