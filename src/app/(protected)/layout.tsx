import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    // Redirect with login_required message
    // Note: We can't easily get the current path in a layout, so the middleware handles the full redirect
    // This is a fallback in case middleware doesn't catch it
    redirect('/login?message=login_required');
  }

  return <>{children}</>;
}
