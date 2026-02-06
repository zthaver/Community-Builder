"use client";

import { Button } from "../ui/button";
import React, { useEffect } from "react";
import { BookIcon, ContactIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";
import { logout } from "./actions";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUser, clearUser } from "../../../store/slices/authSlice";
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth?.user);

  async function handleLogout() {
await supabase.auth.signOut();
  }


  return (
    <nav className="w-full h-full px-4 py-2 shadow-xl bg-white">
      <div className="flex justify-between md:justify-start items-center space-x-90">
        <img className="w-16" src="/images.png" />

        <div className="flex-1 flex auto space-x-2 justify-center">
          <div className="flex items-center space-x-1">
            <HouseIcon color="grey" size={36} />
            <Button variant={pathname === "/" ? "ghost" : "default"} className={pathname === "/" ? "bg-blue-500 text-white" : ""}>
              <Link href="/">Home</Link>
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <BookIcon color="grey" size={36} />
            <Button variant={pathname === "/blog" ? "ghost" : "default"} className={pathname === "/blog" ? "bg-blue-500 text-white" : ""}>
              <Link href="/blog">Articles</Link>
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <ContactIcon color="grey" size={36} />
            <Button variant={pathname === "/calendar" ? "ghost" : "default"} className={pathname === "/calendar" ? "bg-blue-500 text-white" : ""}>
              <Link href="/calendar">Events</Link>
            </Button>
          </div>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Hello, {user.email}</span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
            </div>
          ):(
            <Button variant="ghost">
              <Link href="/login">LOGIN</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
