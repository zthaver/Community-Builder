"use client";

import { useEffect } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { useAppDispatch } from "../../../store/hooks";
import { setUser, clearUser } from "../../../store/slices/authSlice";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const supabase = createClient();

    // Force refresh session to sync with server cookies
    supabase.auth.refreshSession().then(({ data }) => {
      if (data.session?.user) dispatch(setUser(data.session.user));
      else dispatch(clearUser());
    });

    // Listen to auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) dispatch(setUser(session.user));
      else dispatch(clearUser());
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}