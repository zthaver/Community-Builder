'use server';

import { User, UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';
import dotenv from 'dotenv';

const fetchHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
};

export async function getblogData() {
  try {
    const supabase = await createClient();
    const user: User | null = (await supabase.auth.getUser()).data.user;

    if (user == null) {
      redirect('/login');
    }

    const apiUrl = process.env.CMS_API_URL;
    if (!apiUrl) {
      console.error('CMS_API_URL is not configured');
      return { data: [], error: 'Articles are temporarily unavailable.' };
    }

    const response = await fetch(apiUrl + '?populate=blogImage', { headers: fetchHeaders });
    
    if (!response.ok) {
      console.error(`Blog API error: ${response.status} ${response.statusText}`);
      return { data: [], error: 'Unable to load articles. Please try again later.' };
    }

    const blogData = await response.json();
    return blogData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { data: [], error: 'Unable to load articles. Please try again later.' };
  }
}

export async function getSlugifiedblogData(id: string) {
  try {
    const apiUrl = process.env.CMS_API_URL;
    if (!apiUrl) {
      console.error('CMS_API_URL is not configured');
      return { data: null, error: 'Article is temporarily unavailable.' };
    }

    const blogResponse = await fetch(
      `${apiUrl}/${id}?populate=blogImage`,
      { headers: fetchHeaders }
    );
    
    if (!blogResponse.ok) {
      console.error(`Blog API error: ${blogResponse.status} ${blogResponse.statusText}`);
      return { data: null, error: 'Unable to load article. Please try again later.' };
    }

    const slugifiedData = await blogResponse.json();
    return slugifiedData;
  } catch (error) {
    console.error('Error fetching blog article:', error);
    return { data: null, error: 'Unable to load article. Please try again later.' };
  }
}

export async function getBlogComments(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', id);
  console.log('Comments Data:', data);
  console.log('Comments Error:', error);
  return { data, error };
}
export async function handleSubmitComment(
  articleId: string,
  commentText: string,
) {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;

  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  // Try to resolve a display name from the `users` table, fall back to email
  let userName: string | null = null;
  try {
    const { data: userRow } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single();
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
