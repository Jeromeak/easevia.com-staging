'use client';
import { ArrowDown, TimerIcon, RefundIcon } from '@/icons/icon';
import { useState, useCallback, Fragment } from 'react';
import clsx from 'clsx';
import { RaiseTicketModal } from './RaiseTicketModal';
import { UserData } from './UserData';
import type { SupportTabProps } from '@/lib/types/common.types';

const supportTickets = [
  {
    id: 1,
    subject: '[Subscription Issue] Assistance Required',
    ticketId: '25689342',
    regarding: 'Subscription',
    dateCreated: '09.06.2025 16:24',
    lastUpdated: '09.06.2025 16:24',
    updatedBy: '09.06.2025 16:24',
  },
  {
    id: 2,
    subject: '[Subscription Issue] Assistance Required',
    ticketId: '25689342',
    regarding: 'Subscription',
    dateCreated: '09.06.2025 16:24',
    lastUpdated: '09.06.2025 16:24',
    updatedBy: '09.06.2025 16:24',
  },
  {
    id: 3,
    subject: '[Subscription Issue] Assistance Required',
    ticketId: '25689342',
    regarding: 'Subscription',
    dateCreated: '09.06.2025 16:24',
    lastUpdated: '09.06.2025 16:24',
    updatedBy: '09.06.2025 16:24',
  },
  {
    id: 4,
    subject: '[Subscription Issue] Assistance Required',
    ticketId: '25689342',
    regarding: 'Subscription',
    dateCreated: '09.06.2025 16:24',
    lastUpdated: '09.06.2025 16:24',
    updatedBy: '09.06.2025 16:24',
  },
  {
    id: 5,
    subject: '[Subscription Issue] Assistance Required',
    ticketId: '25689342',
    regarding: 'Subscription',
    dateCreated: '09.06.2025 16:24',
    lastUpdated: '09.06.2025 16:24',
    updatedBy: '09.06.2025 16:24',
  },
];

export const SupportTab: React.FC<SupportTabProps> = () => {
  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<(typeof supportTickets)[0] | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState<boolean>(false);

  const handleSetActiveTab = useCallback(() => {}, []);
  const handleRaiseTicket = useCallback(() => {
    setShowRaiseTicketModal(true);
  }, []);

  const handleCloseRaiseTicketModal = useCallback(() => {
    setShowRaiseTicketModal(false);
  }, []);

  const handleTicketClick = useCallback((ticket: (typeof supportTickets)[0]) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  }, []);

  const handleBackToTickets = useCallback(() => {
    setShowTicketDetails(false);
    setSelectedTicket(null);
  }, []);

  const ticketStatuses = [
    {
      icon: <TimerIcon width="14" height="15" />,
      status: 'In review',
      description: 'Our team is taking a look',
      color: '#F69000',
    },
    {
      icon: <TimerIcon width="14" height="15" />,
      status: 'Processing',
      description: 'Our team is taking a look',
      color: '#F69000',
    },
    {
      icon: <TimerIcon width="14" height="15" />,
      status: 'Approved',
      description: 'Your request is approved',
      color: '#F69000',
    },
    {
      icon: <TimerIcon width="14" height="15" />,
      status: 'Proof of payment needed',
      description: 'Upload proof of payment',
      color: '#F44336',
    },
    {
      icon: <RefundIcon width="14" height="15" />,
      status: 'Refund approved',
      description: 'Refund approved',
      color: '#4CAF50',
    },
  ];

  const getStatusIconClass = useCallback(
    (color: string) =>
      clsx(
        'flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5',
        color === '#F69000' && 'text-orange-500',
        color === '#4CAF50' && 'text-green-500',
        color === '#F44336' && 'text-red-500'
      ),
    []
  );

  const handleTicketClickMemo = useCallback(
    (ticket: (typeof supportTickets)[0]) => () => handleTicketClick(ticket),
    [handleTicketClick]
  );

  if (showTicketDetails && selectedTicket) {
    return (
      <Fragment>
        <div className="w-full lg:flex hidden lg:static sticky top-[77px] flex-wrap z-50  justify-between rounded-e-sm items-center px-5 md:px-8 h-20 bg-[#E6F2F2] dark:bg-gray-300">
          <div className="md:text-32 text-2xl md:leading-[32px] text-neutral-50 dark:text-white tracking-wider uppercase font-Neutra">
            Support Tickets
          </div>
          <div>
            <button
              onClick={handleRaiseTicket}
              className="bg-Teal-500 Teal text-white px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full"
            >
              Raise Ticket
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 mt-34 md:mt-16 lg:mt-0">
          <div className="mb-6">
            <button
              onClick={handleBackToTickets}
              className="text-neutral-50 dark:text-white hover:text-Teal-500 transition-colors cursor-pointer text-base"
            >
              Support/Ticket/[Subscription Issue] Assistance Required
            </button>
          </div>

          <div className="space-y-6">
            {ticketStatuses.map((item, index) => (
              <div key={index} className="flex items-start ">
                <div className={getStatusIconClass(item.color)}>{item.icon}</div>
                <div className="flex-1">
                  <div className="text-neutral-50 dark:text-white font-inter text-sm font-normal leading-normal">
                    {item.status}
                  </div>
                  <p className="text-[#737373] font-inter text-xs font-normal leading-normal mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RaiseTicketModal isOpen={showRaiseTicketModal} onClose={handleCloseRaiseTicketModal} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="w-full lg:flex hidden lg:static sticky top-[77px] flex-wrap z-50  justify-between rounded-e-sm items-center px-5 md:px-8 h-20 bg-[#E6F2F2] dark:bg-gray-300">
        <div className="md:text-32 text-2xl md:leading-[32px] text-neutral-50 dark:text-white tracking-wider uppercase font-Neutra">
          Support Tickets
        </div>
        <div>
          <button
            onClick={handleRaiseTicket}
            className="bg-Teal-500 Teal text-white px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full"
          >
            Raise Ticket
          </button>
        </div>
      </div>

      <div className="w-full text-white">
        <div className="p-4 lg:p-6 md:p-8 lg:mt-0 mt-10">
          <div className="lg:block hidden dark:bg-black rounded-lg overflow-auto">
            <table className="w-full min-w-[800px] whitespace-nowrap">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-Teal-300 dark:bg-[#151515]">
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      # <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      Subject <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      Ticket ID <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      Regarding <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      Date Created <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      Last Updated <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-neutral-50 dark:text-[#D4D4D4] text-xs font-normal">
                    <div className="flex items-center gap-2">
                      Updated by <ArrowDown width="12" height="12" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {supportTickets.map((ticket, index) => (
                  <tr key={ticket.id} className="hover:bg-gray-700/20 duration-200">
                    <td className="py-4 px-4 text-neutral-50 dark:text-white text-sm">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div
                        className="text-[#009898] text-xs cursor-pointer hover:underline"
                        onClick={handleTicketClickMemo(ticket)}
                      >
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-50 dark:text-white text-sm">{ticket.ticketId}</td>
                    <td className="py-4 px-4 text-neutral-50 dark:text-white text-sm">{ticket.regarding}</td>
                    <td className="py-4 px-4 text-[#6D717F] dark:text-white text-sm">{ticket.dateCreated}</td>
                    <td className="py-4 px-4 text-[#6D717F] dark:text-white text-sm">{ticket.lastUpdated}</td>
                    <td className="py-4 px-4 text-[#6D717F] dark:text-white text-sm">{ticket.updatedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full lg:hidden flex flex-col gap-3 lg:mt-0 mt-30">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex flex-col w-full">
                <div
                  className="text-Teal-500 text-sm font-medium cursor-pointer hover:underline"
                  onClick={handleTicketClickMemo(ticket)}
                >
                  {ticket.subject}
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="text-neutral-50 dark:text-[#979797] text-xs">Ticket ID</div>
                  <div className="text-xs text-white font-medium">{ticket.ticketId}</div>
                </div>
                <div className="flex gap-1">
                  <div className="text-neutral-50 dark:text-[#979797]] text-xs">Regarding</div>
                  <div className="text-xs text-white font-medium">{ticket.regarding}</div>
                </div>
                <div className="flex items-stretch gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-neutral-50 dark:text-[#979797] text-xs">Date Created</div>
                    <div className="text-xs text-white font-medium">{ticket.dateCreated}</div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-neutral-50 dark:text-[#979797] text-xs">Last Updated</div>
                    <div className="text-xs text-white font-medium">{ticket.lastUpdated}</div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-neutral-50 dark:text-[#979797] text-xs">Updated by</div>
                    <div className="text-xs text-white font-medium">{ticket.updatedBy}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RaiseTicketModal isOpen={showRaiseTicketModal} onClose={handleCloseRaiseTicketModal} />
      <div className="lg:hidden block">
        <UserData progress={50} activeTab="Support" setActiveTab={handleSetActiveTab}>
          <button
            onClick={handleRaiseTicket}
            className="bg-Teal-500 text-white px-3 flex items-center gap-1 uppercase text-xs cursor-pointer py-1 rounded-full"
          >
            <div>Raise Ticket</div>
          </button>
        </UserData>
      </div>
    </Fragment>
  );
};
