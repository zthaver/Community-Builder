'use server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from "next/server";
import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    role: formData.get("role") as string,

  }

  const { data:userData,error } = await supabase.auth.signInWithPassword(data)
  if(data.role == "moderator")
  {
    redirect("/moderator");
  }
  if(data.role == "familymember")
  {
      redirect("/moderator");
  }
  if(data.role == "familymember")
    {
        redirect("/moderator");
    }


  if (error) {
      NextResponse.redirect('/error')
  }

  revalidatePath('/home', 'layout')
  redirect('/home')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    role: formData.get("role") as string,
  }

  const { error, data:userData } = await supabase.auth.signUp(data)

  console.log({ userData,error})
  console.log(data.role);

  if (error) {
    console.log("error");
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}