import { EditIcon, PlaneIcon, SingaporeAirlineIcon } from '@/icons/icon';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import type { SelectedFlightData } from '@/lib/types/sessionStorage';
import { extractFlightData } from '@/utils/flightUtils';

interface TicketCardDetailProps {
  selectedFlightData?: SelectedFlightData | null;
}

export const TicketCardDetail = ({ selectedFlightData }: TicketCardDetailProps) => {
  const router = useRouter();

  // Handle change button click - redirect to ticket page
  const handleChangeFlight = () => {
    router.push('/ticket');
  };

  // Format time from ISO string to readable format using moment.js
  const formatTime = (isoString: string) => {
    return moment(isoString).format('HH:mm');
  };

  // Format date from ISO string to "DD MMM" format using moment.js
  const formatDate = (isoString: string) => {
    return moment(isoString).format('DD MMM');
  };

  // Use selected flight data or fallback to dummy data
  const flightData = selectedFlightData
    ? (() => {
        const flights = [];

        // For one-way trips
        if (selectedFlightData.selectedFlight) {
          const flightInfo = extractFlightData(selectedFlightData.selectedFlight);
          flights.push({
            airline: flightInfo.airline,
            flightNumber: flightInfo.flightNumber,
            departureDate: formatDate(flightInfo.departure_time),
            arrivalDate: formatDate(flightInfo.arrival_time),
            departureTime: formatTime(flightInfo.departure_time),
            arrivalTime: formatTime(flightInfo.arrival_time),
            departureLocation: flightInfo.departure_airport,
            arrivalLocation: flightInfo.arrival_airport,
            flightDuration: flightInfo.duration,
            directFlight: flightInfo.isDirect,
            stops: flightInfo.stops,
            stopAirports: flightInfo.stopAirports,
          });
        }

        // For round trips - outbound flight
        if (selectedFlightData.selectedOutboundFlight) {
          const flightInfo = extractFlightData(selectedFlightData.selectedOutboundFlight);
          flights.push({
            airline: flightInfo.airline,
            flightNumber: flightInfo.flightNumber,
            departureDate: formatDate(flightInfo.departure_time),
            arrivalDate: formatDate(flightInfo.arrival_time),
            departureTime: formatTime(flightInfo.departure_time),
            arrivalTime: formatTime(flightInfo.arrival_time),
            departureLocation: flightInfo.departure_airport,
            arrivalLocation: flightInfo.arrival_airport,
            flightDuration: flightInfo.duration,
            directFlight: flightInfo.isDirect,
            stops: flightInfo.stops,
            stopAirports: flightInfo.stopAirports,
          });
        }

        // For round trips - return flight
        if (selectedFlightData.selectedReturnFlight) {
          const flightInfo = extractFlightData(selectedFlightData.selectedReturnFlight);
          flights.push({
            airline: flightInfo.airline,
            flightNumber: flightInfo.flightNumber,
            departureDate: formatDate(flightInfo.departure_time),
            arrivalDate: formatDate(flightInfo.arrival_time),
            departureTime: formatTime(flightInfo.departure_time),
            arrivalTime: formatTime(flightInfo.arrival_time),
            departureLocation: flightInfo.departure_airport,
            arrivalLocation: flightInfo.arrival_airport,
            flightDuration: flightInfo.duration,
            directFlight: flightInfo.isDirect,
            stops: flightInfo.stops,
            stopAirports: flightInfo.stopAirports,
          });
        }

        return flights;
      })()
    : [
        {
          airline: 'Singapore Airline',
          flightNumber: 'SQ123',
          departureDate: '18 Apr',
          arrivalDate: '19 Apr',
          departureTime: '06:45',
          arrivalTime: '10:00',
          departureLocation: 'Singapore, SIN',
          arrivalLocation: 'Tokyo, TYO',
          flightDuration: '1h 50min',
          directFlight: true,
          stops: 0,
          stopAirports: [],
        },
      ];

  return (
    <div className="w-full">
      {flightData.map((flight, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-neutral-50 p-4 md:p-6 w-full flex flex-col ${index === 1 ? 'border-t border-dashed border-[#94A3B8]' : ''}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <SingaporeAirlineIcon width="20" height="29" />
              <div className="uppercase text-xs md:text-base text-neutral-50 dark:text-white">{flight.airline}</div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleChangeFlight}
                className={clsx(
                  'flex items-center text-[10px] md:text-xs uppercase rounded-full cursor-pointer gap-1 md:gap-2 px-3 md:px-5 py-1 md:py-1.5 border border-Teal-500 text-Teal-500 justify-center'
                )}
              >
                Change
                <EditIcon className={clsx('md:w-[18px] md:h-[19px] w-4 h-4')} />
              </button>
            </div>
          </div>
          <div className={clsx('w-full flex flex-col mt-6 items-center')}>
            <div className={clsx('flex justify-between w-full items-center')}>
              <div className={clsx('text-[#A3A3A3] text-xs md:text-sm')}>{flight.departureDate}</div>
              <div className={clsx('text-[#A3A3A3] text-xs md:text-sm')}>{flight.arrivalDate}</div>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="text-xl md:text-2xl text-neutral-50 dark:text-white font-medium">
                {flight.departureTime}
              </div>
              <div className="w-[60%] md:w-[calc(78%_-_8px)] flex justify-between gap-2 items-center">
                <div className="border w-[calc(50%_-_4px)] relative border-[#94A3B8] border-dashed">
                  <div className="w-2 h-2 rounded-full bg-[#94A3B8] top-1/2 -translate-y-1/2 left-[-3%] md:left-[-1%] absolute" />
                </div>
                <div className={clsx('flex justify-center ml-2')}>
                  <PlaneIcon className={clsx('text-[#94A3B8] md:w-[40px] lg:h-[40px] w-6 h-6')} />
                </div>
                <div className={clsx('border w-[calc(50%_-_4px)] border-dashed border-[#94A3B8] relative')}>
                  <div
                    className={clsx('w-2 h-2 rounded-full bg-[#94A3B8] top-1/2 -translate-y-1/2 right-[-1%] absolute')}
                  />
                </div>
              </div>
              <div className="text-xl md:text-2xl text-neutral-50 dark:text-white font-medium">
                {flight.arrivalTime}
              </div>
            </div>
            <div className={clsx('flex justify-between w-full items-center')}>
              <div className={clsx('text-[#A3A3A3] text-xs md:text-sm')}>{flight.departureLocation}</div>
              <div className={clsx('text-[#A3A3A3] text-xs md:text-sm flex items-center gap-2')}>
                <div>{flight.flightDuration}</div>
                <div className={clsx('w-1 h-1 rounded-full bg-[#A3A3A3]')} />
                <div>{flight.directFlight ? 'Direct Flight' : 'Non-direct Flight'}</div>
              </div>
              <div className={clsx('text-[#A3A3A3] text-sm')}>{flight.arrivalLocation}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
