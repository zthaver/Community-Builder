'use server'

import { User, UserResponse } from '@supabase/supabase-js';
import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import dotenv from "dotenv";

export async function getblogData() {

    const supabase = await createClient();


    const user: User | null = (await supabase.auth.getUser()).data.user;

    if (user == null) {
        redirect("/home");
    }

  const apiUrl = process.env.CMS_API_URL! + "?populate=blogImage";
  const response = await fetch(apiUrl);
  const blogData = await response.json();

  return blogData;

}


export async function getSlugifiedblogData(id:string) {
    const blogResponse =  await fetch(`${process.env.CMS_API_URL}/${id}?populate=blogImage`)
    const slugifiedData = await blogResponse.json();

    return slugifiedData;


}