import React from 'react';
import type { BookingItem } from '@/lib/types/api/booking';

interface TicketCardProps {
  ticket: BookingItem;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const displayDate = ticket.booking_date || '';

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{ticket.booking_reference}</h3>
          {(ticket.origin || ticket.destination) && (
            <p className="text-gray-600 text-sm">
              {ticket.origin || ''} → {ticket.destination || ''}
            </p>
          )}
          <p className="text-gray-500 text-xs">{displayDate}</p>
        </div>
        <div className="text-right">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              ticket.status === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : ticket.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {ticket.status}
          </span>
        </div>
      </div>
    </div>
  );
};
