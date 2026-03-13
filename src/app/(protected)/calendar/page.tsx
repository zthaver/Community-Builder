'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getCalendarData } from '../../calendar/actions';
import { CalendarIcon, ClockIcon, MapPinIcon, LinkIcon, XIcon, Loader2Icon, ListIcon, CalendarDaysIcon } from 'lucide-react';

type ExtendedProps = {
  link: string;
  location: string;
};

type CalendarEvent = {
  id?: string;
  title: string;
  start: string;
  end: string;
  extendedProps?: ExtendedProps;
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

const formatShortDate = (datetimeStr: string) =>
  new Date(datetimeStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const formatTime = (datetimeStr: string) =>
  new Date(datetimeStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

const CalendarPage = () => {
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);

  const getAbsoluteLink = (link?: string) => {
    if (!link) return '#';
    return link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `https://${link}`;
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: formatDateTime(clickInfo.event.start),
      end: formatDateTime(clickInfo.event.end),
      extendedProps: clickInfo.event.extendedProps,
    });
  };

  const handleSidebarEventClick = (event: CalendarEvent) => {
    setSelectedEvent({
      title: event.title,
      start: formatDateTime(event.start),
      end: formatDateTime(event.end),
      extendedProps: event.extendedProps || { link: '', location: '' },
    });

    // Navigate calendar to the event's month
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(event.start);
    }
  };

  useEffect(() => {
    const fetchCalendarData = async () => {
      const data = await getCalendarData();
      setCalendarData(data.data || []);
      setLoading(false);
    };

    fetchCalendarData();
  }, []);

  const sortedEvents = useMemo(() => {
    return [...calendarData].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [calendarData]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return sortedEvents.filter(event => new Date(event.start) >= now);
  }, [sortedEvents]);

  const pastEvents = useMemo(() => {
    const now = new Date();
    return sortedEvents.filter(event => new Date(event.start) < now).reverse();
  }, [sortedEvents]);

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
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <CalendarIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find workshops, social gatherings, and activities to participate in. 
            Click on any event to see more details.
          </p>
        </div>

        {/* Main Content - Calendar + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Events Sidebar */}
          <div className="lg:w-96 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              {/* Sidebar Header */}
              <div className="bg-blue-600 text-white p-5">
                <div className="flex items-center gap-3">
                  <ListIcon className="w-7 h-7" />
                  <h2 className="text-2xl font-bold">All Events</h2>
                </div>
                <p className="text-blue-100 mt-1">Click any event for details</p>
              </div>

              {/* Events List */}
              <div className="max-h-[600px] overflow-y-auto">
                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <div>
                    <div className="bg-green-100 px-5 py-3 border-b border-green-200">
                      <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                        <CalendarDaysIcon className="w-5 h-5" />
                        Upcoming Events ({upcomingEvents.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {upcomingEvents.map((event, index) => (
                        <button
                          key={event.id || index}
                          onClick={() => handleSidebarEventClick(event)}
                          className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${
                            selectedEvent?.title === event.title && selectedEvent?.start === formatDateTime(event.start)
                              ? 'bg-blue-100 border-l-4 border-blue-600'
                              : ''
                          }`}
                        >
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 text-base text-gray-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatShortDate(event.start)}</span>
                            <span className="text-gray-400">•</span>
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatTime(event.start)}</span>
                          </div>
                          {event.extendedProps?.location && (
                            <div className="flex items-center gap-2 text-base text-gray-500 mt-1">
                              <MapPinIcon className="w-4 h-4" />
                              <span className="truncate">{event.extendedProps.location}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-600 flex items-center gap-2">
                        <CalendarDaysIcon className="w-5 h-5" />
                        Past Events ({pastEvents.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {pastEvents.map((event, index) => (
                        <button
                          key={event.id || `past-${index}`}
                          onClick={() => handleSidebarEventClick(event)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors opacity-70 ${
                            selectedEvent?.title === event.title && selectedEvent?.start === formatDateTime(event.start)
                              ? 'bg-gray-100 border-l-4 border-gray-400'
                              : ''
                          }`}
                        >
                          <h4 className="text-lg font-semibold text-gray-700 mb-1">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 text-base text-gray-500">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatShortDate(event.start)}</span>
                            <span className="text-gray-400">•</span>
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatTime(event.start)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Events */}
                {calendarData.length === 0 && (
                  <div className="p-8 text-center">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg text-gray-500">No events scheduled yet.</p>
                    <p className="text-base text-gray-400">Check back soon!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calendar + Event Details */}
          <div className="flex-1 order-1 lg:order-2 space-y-6">
            {/* Selected Event Details */}
            {selectedEvent && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold pr-4">{selectedEvent.title}</h3>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="p-2 hover:bg-blue-700 rounded-lg transition-colors shrink-0"
                      aria-label="Close event details"
                    >
                      <XIcon size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ClockIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Starts</p>
                        <p className="text-xl text-gray-900">{selectedEvent.start}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <ClockIcon className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Ends</p>
                        <p className="text-xl text-gray-900">{selectedEvent.end}</p>
                      </div>
                    </div>

                    {selectedEvent.extendedProps?.location && (
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <MapPinIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700">Location</p>
                          <p className="text-xl text-gray-900">{selectedEvent.extendedProps.location}</p>
                        </div>
                      </div>
                    )}

                    {selectedEvent.extendedProps?.link && (
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <LinkIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700">Event Link</p>
                          <a
                            href={getAbsoluteLink(selectedEvent.extendedProps.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl text-blue-600 hover:text-blue-800 underline"
                          >
                            Click here to join
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tip when no event selected */}
            {!selectedEvent && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <p className="text-lg text-blue-800 text-center">
                  <strong>Tip:</strong> Click on any event in the list on the left, or on the calendar below to see its details.
                </p>
              </div>
            )}

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <style>{`
                .calendar-elderly .fc {
                  font-size: 1.125rem;
                }
                .calendar-elderly .fc-toolbar-title {
                  font-size: 1.5rem !important;
                  font-weight: 700;
                }
                .calendar-elderly .fc-button {
                  font-size: 1rem !important;
                  padding: 0.6rem 1rem !important;
                  min-height: 44px;
                  border-radius: 0.5rem !important;
                }
                .calendar-elderly .fc-col-header-cell {
                  padding: 12px 0;
                  font-size: 1rem;
                  font-weight: 600;
                  background-color: #f3f4f6;
                }
                .calendar-elderly .fc-daygrid-day {
                  min-height: 100px;
                }
                .calendar-elderly .fc-daygrid-day-number {
                  padding: 8px;
                  font-size: 1.125rem;
                  font-weight: 500;
                }
                .calendar-elderly .fc-event {
                  font-size: 1rem !important;
                  padding: 6px 10px !important;
                  border-radius: 6px !important;
                  cursor: pointer;
                  min-height: 36px;
                }
                .calendar-elderly .fc-event:hover {
                  transform: scale(1.02);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .calendar-elderly .fc-daygrid-event-harness {
                  margin-bottom: 3px;
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
                  ref={calendarRef}
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
                    today: 'Today',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
