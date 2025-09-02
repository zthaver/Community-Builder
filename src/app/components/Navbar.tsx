import { Button } from '@/components/ui/button'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="w-full  h-full px-4 py-2 shadow-xl bg-white">
      <div className="flex justify-between items-center  space-x-90">
        <img className="w-16" src="/images.png"/>
        <div className="flex-1 flex auto space-x-2 justify-center">
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button>
        </div>
        <div>
          <Button variant="ghost">Login</Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar