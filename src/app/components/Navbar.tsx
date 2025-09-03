import { Button } from '@/components/ui/button'
import React from 'react'
import { BookIcon ,ContactIcon, HouseIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full  h-full px-4 py-2 shadow-xl bg-white">
      <div className="flex justify-between md:justify-start items-center  space-x-90">
        <img className="w-16" src="/images.png"/>
        <div className="flex-1 flex auto space-x-2 justify-center">
          <div className="flex items-center space-x-1">
            <HouseIcon color="grey" size={36} />
            <Button variant="default">HOME</Button>
          </div>
          <div className="flex items-center space-x-1">
            <BookIcon color="grey" size={36} />
            <Button variant="default">ABOUT</Button>
          </div>
          <div className="flex items-center space-x-1">
            <ContactIcon color="grey" size={36} />
            <Button variant="default">CONTACT</Button>
          </div>
        </div>
        <div>
          <Button variant="ghost">Login</Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar