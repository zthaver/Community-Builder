"use server"

import { redirect } from 'next/navigation'

import { createClient } from '../../../../utils/supabase/server';


export async function logout() {
    console.log("in lgout function");
  const supabase =  createClient();
  (await supabase).auth.signOut();
  redirect("/login") 

}