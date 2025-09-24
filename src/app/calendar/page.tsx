'use client'

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

const page = () => {
  return (
         <FullCalendar
         events="https://fullcalendar.io/api/demo-feeds/events.json"
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
    />
  )
}

export default page