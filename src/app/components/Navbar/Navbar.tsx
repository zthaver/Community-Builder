'use client';

import { Button } from '../ui/button';
import React, { useEffect } from 'react';
import { BookIcon, CalendarIcon, HouseIcon, LogOutIcon, LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/client';
import { logout } from './actions';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setUser, clearUser } from '../../../store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth?.user);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className="w-full px-6 py-4 shadow-lg bg-white border-b-2 border-gray-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img className="w-14 h-14" src="/images.png" alt="Community Builder Logo" />
          <span className="text-xl font-bold text-gray-800 hidden md:block">Community Builder</span>
        </Link>

        {/* Navigation Links - Large touch targets */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/" 
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors min-h-[52px] ${
              isActive('/') && !isActive('/blog') && !isActive('/calendar')
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HouseIcon size={28} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link 
            href="/blog" 
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors min-h-[52px] ${
              isActive('/blog') 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookIcon size={28} />
            <span className="hidden sm:inline">Articles</span>
          </Link>

          <Link 
            href="/calendar" 
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors min-h-[52px] ${
              isActive('/calendar') 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CalendarIcon size={28} />
            <span className="hidden sm:inline">Events</span>
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-lg text-gray-700 hidden md:block">
                Hello, <strong>{user.email?.split('@')[0]}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors min-h-[52px]"
              >
                <LogOutIcon size={24} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors min-h-[52px]"
            >
              <LogInIcon size={24} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
