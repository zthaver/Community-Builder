'use client'

import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { getCalendarData } from './actions'

const page = () => {

  let [calendarData,setCalendarData] = useState([]);
  let [selectedEvent,setSelectedEvent] = useState({});

   const handleEventClick = (clickInfo:any) => {
    console.log(clickInfo.event)
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start?.toLocaleString(),
      end: clickInfo.event.end?.toLocaleString(),
      extendedProps: clickInfo.event.extendedProps, // include extra data if any
    });
  };
  useEffect(()=>{
        const fetchCalendarData = async () =>{
        const blogData = await getCalendarData();
        setCalendarData(blogData.data);
        }
    
        fetchCalendarData();
          if (selectedEvent) {
    console.log("Selected event updated:", selectedEvent);
  }

  },[selectedEvent])
  return (
         <FullCalendar
         events={calendarData}
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      eventClick={handleEventClick}
    />
  )
}

export default page