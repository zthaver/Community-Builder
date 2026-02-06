'use client'

import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { getCalendarData } from '../../calendar/actions'
import EventPopover from '../../components/EventPopover'
import { Popover, PopoverTrigger } from '../../components/ui/popover'
import { PopoverContent } from '../../components/popover'
import { Button } from '../../components/ui/button'
type ExtendedProps =
  {
    link: string,
    location: string
  }

type SelectedEvent = {
  title: string,
  start: string,
  end: string,
  extendedProps: ExtendedProps
}
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
      const suffix = (n > 3 && n < 21) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
      return `${n}${suffix}`;
    })
    .replace(',', ' at');

const page = () => {
  let [calendarData, setCalendarData] = useState([]);
  let [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  let [popoverOpen, setPopoverOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const getAbsoluteLink = (link?: string) => {
  if (!link) return '#';
  return link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
};

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  }
  const handleEventClick = (clickInfo: any) => {
    console.log(clickInfo.jsEvent.clientX)
    console.log(clickInfo.jsEvent.clientY)
    setClickPosition({
      x: clickInfo.jsEvent.clientX + 10,
      y: clickInfo.jsEvent.clientY + 10,
    });
    setPopoverOpen(true);
    setSelectedEvent({
      title: clickInfo.event.title,
      start: formatDateTime(clickInfo.event.start),
      end: formatDateTime(clickInfo.event.end),
      extendedProps: clickInfo.event.extendedProps, // include extra data if any
    });
    if (selectedEvent) {
      console.log("selectedevent" + selectedEvent?.title);
    }


  };
  useEffect(() => {
    const fetchCalendarData = async () => {
      const blogData = await getCalendarData();
      setCalendarData(blogData.data);
    }

    fetchCalendarData();
    if (selectedEvent) {
      console.log("Selected event updated:", selectedEvent.extendedProps.link);
    }

  }, [selectedEvent])
  return (
    <div>
      <style>{`
        .calendar-large .fc {
          font-size: 20px;
        }
        .calendar-large .fc-col-header-cell {
          padding: 12px 0;
          font-size: 18px;
        }
        .calendar-large .fc-daygrid-day {
          height: 100px;
        }
        .calendar-large .fc-daygrid-day-number {
          padding: 8px;
          font-size: 16px;
        }
        .calendar-large .fc-event {
          font-size: 20px;
        }
      `}</style>
      <div className="calendar-large">
        <FullCalendar
          events={calendarData}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          contentHeight="auto"
          eventClick={handleEventClick} />
      </div>
      <div className='absolute z-50'
        style={{
          top: clickPosition.y,
          left: clickPosition.x
        }}
      >
        <Popover open={popoverOpen}
          onOpenChange={(open) => { setPopoverOpen(open) }}>
          <PopoverTrigger>
            <div style={{ width: 1, height: 1 }} /> {/* Invisible trigger at click position */}
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              {selectedEvent?.title}
              <div className="space-y-2">
                Starts: {selectedEvent?.start}
              </div>
              <div className="space-y-2">
                Ends {selectedEvent?.end}
              </div>
              <div className="space-y-2">
                {selectedEvent?.extendedProps?.link && (
                  <p>
                    Link:{' '}
                    <a
                      href={getAbsoluteLink(selectedEvent.extendedProps.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedEvent.extendedProps.link}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default page