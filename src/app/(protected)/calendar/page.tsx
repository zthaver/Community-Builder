'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getCalendarData } from '../../calendar/actions';
import { Popover, PopoverTrigger } from '../../components/ui/popover';
import { PopoverContent } from '../../components/popover';
import { CalendarIcon, ClockIcon, MapPinIcon, LinkIcon, XIcon, Loader2Icon } from 'lucide-react';

type ExtendedProps = {
  link: string;
  location: string;
};

type SelectedEvent = {
  title: string;
  start: string;
  end: string;
  extendedProps: ExtendedProps;
};

const formatDateTime = (datetimeStr: string, timeZone = 'America/New_York') =>
  new Date(datetimeStr)
    .toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone,
    })
    .replace(/(\d+)(?=,)/, (_, day) => {
      const n = Number(day);
      const suffix =
        n > 3 && n < 21 ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th';
      return `${n}${suffix}`;
    })
    .replace(',', ' at');

const CalendarPage = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  const getAbsoluteLink = (link?: string) => {
    if (!link) return '#';
    return link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `https://${link}`;
  };

  const handleEventClick = (clickInfo: any) => {
    setClickPosition({
      x: Math.min(clickInfo.jsEvent.clientX + 10, window.innerWidth - 400),
      y: clickInfo.jsEvent.clientY + 10,
    });
    setPopoverOpen(true);
    setSelectedEvent({
      title: clickInfo.event.title,
      start: formatDateTime(clickInfo.event.start),
      end: formatDateTime(clickInfo.event.end),
      extendedProps: clickInfo.event.extendedProps,
    });
  };

  useEffect(() => {
    const fetchCalendarData = async () => {
      const data = await getCalendarData();
      setCalendarData(data.data || []);
      setLoading(false);
    };

    fetchCalendarData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <CalendarIcon className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find workshops, social gatherings, and activities to participate in. 
            Click on any event to see more details.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-8">
          <p className="text-lg text-blue-800 text-center">
            <strong>Tip:</strong> Click on any colored event in the calendar below to see more information about it.
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <style>{`
            .calendar-elderly .fc {
              font-size: 1.25rem;
            }
            .calendar-elderly .fc-toolbar-title {
              font-size: 1.75rem !important;
              font-weight: 700;
            }
            .calendar-elderly .fc-button {
              font-size: 1.125rem !important;
              padding: 0.75rem 1.25rem !important;
              min-height: 48px;
              border-radius: 0.5rem !important;
            }
            .calendar-elderly .fc-col-header-cell {
              padding: 16px 0;
              font-size: 1.125rem;
              font-weight: 600;
              background-color: #f3f4f6;
            }
            .calendar-elderly .fc-daygrid-day {
              min-height: 120px;
            }
            .calendar-elderly .fc-daygrid-day-number {
              padding: 12px;
              font-size: 1.25rem;
              font-weight: 500;
            }
            .calendar-elderly .fc-event {
              font-size: 1.125rem !important;
              padding: 8px 12px !important;
              border-radius: 8px !important;
              cursor: pointer;
              min-height: 40px;
            }
            .calendar-elderly .fc-event:hover {
              transform: scale(1.02);
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .calendar-elderly .fc-daygrid-event-harness {
              margin-bottom: 4px;
            }
            .calendar-elderly .fc-today-button {
              background-color: #3b82f6 !important;
              border-color: #3b82f6 !important;
            }
            .calendar-elderly .fc-prev-button,
            .calendar-elderly .fc-next-button {
              background-color: #6b7280 !important;
              border-color: #6b7280 !important;
            }
          `}</style>
          <div className="calendar-elderly">
            <FullCalendar
              events={calendarData}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              contentHeight="auto"
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: '',
              }}
              buttonText={{
                today: 'Go to Today',
              }}
            />
          </div>
        </div>

        {/* Event Popover */}
        <div
          className="fixed z-50"
          style={{
            top: clickPosition.y,
            left: clickPosition.x,
          }}
        >
          <Popover
            open={popoverOpen}
            onOpenChange={(open) => {
              setPopoverOpen(open);
            }}
          >
            <PopoverTrigger>
              <div style={{ width: 1, height: 1 }} />
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0">
              <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-purple-600 text-white p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold pr-8">{selectedEvent?.title}</h3>
                    <button 
                      onClick={() => setPopoverOpen(false)}
                      className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      <XIcon size={24} />
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-6 h-6 text-green-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Starts</p>
                      <p className="text-lg text-gray-900">{selectedEvent?.start}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-6 h-6 text-red-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Ends</p>
                      <p className="text-lg text-gray-900">{selectedEvent?.end}</p>
                    </div>
                  </div>

                  {selectedEvent?.extendedProps?.location && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Location</p>
                        <p className="text-lg text-gray-900">{selectedEvent.extendedProps.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent?.extendedProps?.link && (
                    <div className="flex items-start gap-3">
                      <LinkIcon className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Event Link</p>
                        <a
                          href={getAbsoluteLink(selectedEvent.extendedProps.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          Click here to join or learn more
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <button
                    onClick={() => setPopoverOpen(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
