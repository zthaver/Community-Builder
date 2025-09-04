'use client'

import React, { useLayoutEffect } from 'react'

const  Moderator =  (id:string) => {
  useLayoutEffect(()=>{
    console.log("Id is" + id);
  })
  return (
    <div>Moderator</div>
  )
}

export default Moderator