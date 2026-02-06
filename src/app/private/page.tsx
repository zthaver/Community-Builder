import { redirect } from 'next/navigation'

import DemoClientComponent from '../components/DemoClientComponent'

export default async function PrivatePage() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return<div>
          <p>Hello {data.user.email}
          </p>
          <DemoClientComponent/>
          </div> 
}