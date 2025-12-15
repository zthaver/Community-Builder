'use client'


import { useState } from 'react';
import { login, signup } from './actions';
import { Button } from "../../app/components/ui/button";
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  return (



  <div>
  <Navbar />

  <div className="min-h-screen flex items-start justify-center pt-10 gap-16">
    {/* Login Form */}
    <div className="flex flex-col items-start">
      <h1 className="text-[60px] mb-4">Login</h1>
      <form className="flex flex-col gap-4">
        <label htmlFor="login-email">Email:</label>
        <input id="login-email" name="email" type="email" required className="p-2 border rounded" />

        <label htmlFor="login-password">Password:</label>
        <input id="login-password" name="password" type="password" required className="p-2 border rounded" />

        <Button formAction={login} className="bg-blue-500 text-white py-2 rounded mt-2">
          Login
        </Button>
      </form>
    </div>

    {/* Sign Up Form */}
    <div className="flex flex-col items-start">
      <h1 className="text-[60px] mb-4">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <label htmlFor="signup-name">Name:</label>
        <input onChange={e => setUserName(e.target.value)} id="signup-name" name="name" type="text" required className="p-2 border rounded" />

        <label htmlFor="signup-email">Email:</label>
        <input onChange={e => setUserEmail(e.target.value)} id="signup-email" name="email" type="email" required className="p-2 border rounded" />

        <label htmlFor="signup-password">Password:</label>
        <input  id="signup-password" name="password" type="password" required className="p-2 border rounded" />

        <label htmlFor="signup-role">Select Role:</label>
        <select
          id="signup-role"
          name="role"
          value={userRole}
          onChange={e => setUserRole(e.target.value!)}
          className="p-2 border rounded"
        >
          <option value="senior">Senior</option>
          <option value="moderator">Moderator</option>
          <option value="familymember">Family Member</option>
        </select>

        <Button variant="ghost" formAction={signup} className="bg-green-500 text-white py-2 rounded mt-2">
          Sign Up
        </Button>
      </form>
    </div>
  </div>
</div>



  )
}