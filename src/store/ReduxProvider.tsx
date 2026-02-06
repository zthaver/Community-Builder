"use client";

import { Provider } from "react-redux";
import { store } from "../store/index";
import { useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAppDispatch } from "../store/hooks";
import { setUser, clearUser } from "../store/slices/authSlice";

function AuthListener({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
  // 1️⃣ Hydrate immediately (CRITICAL)
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) {
      dispatch(setUser(data.session.user));
    }
  });

  // 2️⃣ Listen for future changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      dispatch(setUser(session.user));
    } else {
      dispatch(clearUser());
    }
  });

  return () => subscription.unsubscribe();
}, [dispatch, supabase]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}
