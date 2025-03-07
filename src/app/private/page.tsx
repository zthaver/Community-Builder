import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server'
import DemoClientComponent from '../components/DemoClientComponent'

export default async function PrivatePage() {
  const supabase = await createClient()

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