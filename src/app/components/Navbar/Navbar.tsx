'use client';

import { Button } from '../ui/button';
import React, { useEffect, useState, useTransition } from 'react';
import { BookIcon, CalendarIcon, HouseIcon, LogOutIcon, LogInIcon, Loader2Icon } from 'lucide-react';
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
  
  // Track if component has mounted to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset navigatingTo when pathname changes (navigation complete)
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    if (navigatingTo || pathname === href) return;
    setNavigatingTo(href);
    startTransition(() => {
      router.push(href);
    });
  };

  async function handleLogout() {
    setNavigatingTo('/login');
    await supabase.auth.signOut();
    dispatch(clearUser());
    window.location.href = '/login?message=logged_out';
  }

  // Only calculate active state after mounting to avoid hydration mismatch
  const isActiveHome = mounted && pathname === '/';
  const isActiveBlog = mounted && (pathname === '/blog' || pathname?.startsWith('/blog/'));
  const isActiveCalendar = mounted && (pathname === '/calendar' || pathname?.startsWith('/calendar/'));
  
  const isLoading = isPending || navigatingTo !== null;

  return (
    <nav 
      className="w-full px-6 py-4 shadow-lg bg-white border-b-2 border-gray-200"
      role="navigation"
      aria-label="Main navigation"
      suppressHydrationWarning
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto" suppressHydrationWarning>
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3"
          aria-label="Community Builder - Go to homepage"
        >
          <img className="w-14 h-14" src="/images.png" alt="" aria-hidden="true" />
          <span className="text-xl font-bold text-gray-800 hidden md:block">Community Builder</span>
        </Link>

        {/* Navigation Links - Large touch targets */}
        <div className="flex items-center gap-2 md:gap-4" role="menubar" aria-label="Main menu" suppressHydrationWarning>
          <button 
            onClick={() => handleNavigation('/')}
            disabled={isLoading}
            role="menuitem"
            aria-current={isActiveHome && !isActiveBlog && !isActiveCalendar ? 'page' : undefined}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed ${
              isActiveHome && !isActiveBlog && !isActiveCalendar
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            suppressHydrationWarning
          >
            {navigatingTo === '/' ? (
              <Loader2Icon size={28} className="animate-spin" aria-hidden="true" />
            ) : (
              <HouseIcon size={28} aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Home</span>
            <span className="sr-only sm:hidden">Home</span>
          </button>

          <button 
            onClick={() => handleNavigation('/blog')}
            disabled={isLoading}
            role="menuitem"
            aria-current={isActiveBlog ? 'page' : undefined}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed ${
              isActiveBlog 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            suppressHydrationWarning
          >
            {navigatingTo === '/blog' ? (
              <Loader2Icon size={28} className="animate-spin" aria-hidden="true" />
            ) : (
              <BookIcon size={28} aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Articles</span>
            <span className="sr-only sm:hidden">Articles</span>
          </button>

          <button 
            onClick={() => handleNavigation('/calendar')}
            disabled={isLoading}
            role="menuitem"
            aria-current={isActiveCalendar ? 'page' : undefined}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed ${
              isActiveCalendar 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            suppressHydrationWarning
          >
            {navigatingTo === '/calendar' ? (
              <Loader2Icon size={28} className="animate-spin" aria-hidden="true" />
            ) : (
              <CalendarIcon size={28} aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Events</span>
            <span className="sr-only sm:hidden">Events</span>
          </button>
        </div>

        {/* User Section - Always render login button on server, update on client */}
        <div className="flex items-center gap-3" suppressHydrationWarning>
          {mounted && user ? (
            <>
              <span className="text-lg text-gray-700 hidden md:block">
                Hello, <strong>{user.email?.split('@')[0]}</strong>
              </span>
              <button 
                onClick={handleLogout}
                disabled={isLoading}
                aria-label="Logout from your account"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {navigatingTo === '/login' ? (
                  <Loader2Icon size={24} className="animate-spin" aria-hidden="true" />
                ) : (
                  <LogOutIcon size={24} aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Logout</span>
                <span className="sr-only sm:hidden">Logout</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleNavigation('/login')}
              disabled={isLoading}
              aria-label="Login to your account"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
              suppressHydrationWarning
            >
              {navigatingTo === '/login' ? (
                <Loader2Icon size={24} className="animate-spin" aria-hidden="true" />
              ) : (
                <LogInIcon size={24} aria-hidden="true" />
              )}
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
