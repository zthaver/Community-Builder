'use server'

import { User, UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import dotenv from "dotenv";

export async function getblogData() {

    const supabase = await createClient();
    const user: User | null = (await supabase.auth.getUser()).data.user;

    if (user == null) {
        redirect("/login");
    }

  const apiUrl = process.env.CMS_API_URL! + "?populate=blogImage";
  const response = await fetch(apiUrl);
  const blogData = await response.json();

  return blogData;
}


export async function getSlugifiedblogData(id:string) {
    const blogResponse =  await fetch(`${process.env.CMS_API_URL}/${id}?populate=blogImage`)
    const slugifiedData = await blogResponse.json();
    console.log("Slugified Data:", slugifiedData);

    return slugifiedData;


}

export async function getBlogComments(id:string) {
 const supabase = await createClient();
 const { data, error } = await supabase.from('comments').select('*').eq('article_id', id);
 console.log("Comments Data:", data);
 console.log("Comments Error:", error);
 return { data, error };

}
export async function handleSubmitComment(articleId: string, commentText: string) {
    const supabase = await createClient();
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;

    if (!user) {
        return { data: null, error: { message: 'Not authenticated' } };
    }

    // Try to resolve a display name from the `users` table, fall back to email
    let userName: string | null = null;
    try {
        const { data: userRow } = await supabase.from('users').select('name').eq('id', user.id).single();
        // @ts-ignore
        userName = userRow?.name ?? user.email ?? null;
    } catch (e) {
        // ignore and fallback
        // @ts-ignore
        userName = user.email ?? null;
    }

    const { data, error } = await supabase
        .from('comments')
        .insert([
            {
                article_id: articleId,
                comment_text: commentText,
                user_id: user.id,
                user_name: userName,
            },
        ])
        .select();

    console.log('Inserted comment:', data, 'error:', error);
    return { data, error };
}


