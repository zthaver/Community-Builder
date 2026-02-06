// app/dashboard/layout.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookieStore).getAll(),
        setAll: () => {},
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  console.log("Dashboard layout user:", data.user);

  if (!data.user) {
    console.log("Dashboard layout user: not logged in", data.user)
    redirect('/login')
  }

  return <>{children}</>
}