'use client'


import { useState } from 'react';
import { login, signup } from './actions';
import { Button } from "../../components/ui/button";
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [userRole,setUserRole] = useState("");
  
  return (
   <div>
    <Navbar/>
    <div className='flex items-center justify-center min-h-screens pt-10 '>
      <form className='border-2 rounded shadow'>
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" type="name" required />
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <h1> Select Role</h1>
        <select
        name="role" 
        value={userRole}
         onChange={e=>{
            if(e.target.value!="")
            {
              setUserRole(e.target.value!)
            }}}>
        <option value="senior">Senior</option>
        <option value="moderator">Moderator</option>
        <option value="familymember">Family Member</option>
      </select>
      <Button size="lg"> Test </Button>
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
    </div>
      </div>
    

  )
}