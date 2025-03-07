'use client'


import { useState } from 'react';
import { login, signup } from './actions'

export default function LoginPage() {
  const [userRole,setUserRole] = useState("");
  
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <h1> Select Role</h1>
      <select value={userRole}
      onChange={e=>{
        console.log(e.target.value);
        if(e.target.value!="")
        {
          setUserRole(e.target.value!)
        }
      }}>
        <option value="senior">Senior</option>
        <option value="moderator">Moderator</option>
        <option value="familyMember">Family Member</option>
      </select>
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}