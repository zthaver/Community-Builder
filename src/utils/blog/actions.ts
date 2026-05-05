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

function getErrorMessage(error: unknown, type: 'articles' | 'article' = 'articles'): string {
  const item = type === 'articles' ? 'articles' : 'article';
  
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      return 'Connection timed out. Please check your internet connection and try again.';
    }
    if (error.message.includes('ECONNREFUSED')) {
      return 'Server is unavailable. Please try again later.';
    }
    if (error.message.includes('NetworkError') || error.message.includes('network')) {
      return 'Network error. Please check your internet connection.';
    }
  }
  return `Unable to load ${item}. Please try again later.`;
}

function getHttpErrorMessage(status: number, type: 'articles' | 'article' = 'articles'): string {
  const item = type === 'articles' ? 'articles' : 'article';
  
  if (status === 503) {
    return 'Server is temporarily unavailable. Please try again later.';
  }
  if (status === 500) {
    return 'Server error. Please try again later.';
  }
  if (status === 404) {
    return `${type === 'article' ? 'Article' : 'Articles'} not found.`;
  }
  return `Unable to load ${item}. Please try again later.`;
}

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
      return { data: [], error: 'Articles are temporarily unavailable. Configuration error.' };
    }

    const controller = new AbortController();


    const response = await fetch(apiUrl + '?populate=blogImage', { 
      headers: fetchHeaders,
      signal: controller.signal,
    });

    
    if (!response.ok) {
      console.error(`Blog API error: ${response.status} ${response.statusText}`);
      return { data: [], error: getHttpErrorMessage(response.status, 'articles') };
    }

    const blogData = await response.json();
    return blogData;
  } catch (error: unknown) {
    console.error('Error fetching blog data:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: [], error: 'Request timed out. Please check your internet connection and try again.' };
    }
    
    return { data: [], error: getErrorMessage(error, 'articles') };
  }
}

export async function getSlugifiedblogData(id: string) {
  try {
    const apiUrl = process.env.CMS_API_URL;
    if (!apiUrl) {
      console.error('CMS_API_URL is not configured');
      return { data: null, error: 'Article is temporarily unavailable. Configuration error.' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const blogResponse = await fetch(
      `${apiUrl}/${id}?populate=blogImage`,
      { 
        headers: fetchHeaders,
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    
    if (!blogResponse.ok) {
      console.error(`Blog API error: ${blogResponse.status} ${blogResponse.statusText}`);
      return { data: null, error: getHttpErrorMessage(blogResponse.status, 'article') };
    }

    const slugifiedData = await blogResponse.json();
    return slugifiedData;
  } catch (error: unknown) {
    console.error('Error fetching blog article:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: null, error: 'Request timed out. Please check your internet connection and try again.' };
    }
    
    return { data: null, error: getErrorMessage(error, 'article') };
  }
}

export async function getBlogComments(id: string) {
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', id);
    
    if (error) {
      console.error('Error fetching comments:', error);
      return { data: null, error: 'Unable to load comments. Please try again later.' };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { data: null, error: 'Unable to load comments. Please check your internet connection.' };
  }
}
export async function handleSubmitComment(
  articleId: string,
  commentText: string,
) {
  try {
    const supabase = await createClient();
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
     // Add these temporarily:
     console.log('auth error:', userRes.error);
     console.log('user:', userRes.data.user);
     console.log('user email:', userRes.data.user?.email);
 

     if (!user || user.email?.toLowerCase().trim() === "demo@communitybuilder.com") {
      return { data: null, error: { message: 'Please sign in to post a comment.' } };
      console.log(userRes.data.user.email);
    }
    
     else
     {
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

    if (error) {
      console.error('Error inserting comment:', error);
      return { data: null, error: { message: 'Unable to post comment. Please try again later.' } };
    }

    return { data, error: null };
  }
  } catch (error) {
    console.error('Error submitting comment:', error);
    return { data: null, error: { message: 'Unable to post comment. Please check your internet connection.' } };
  }
}
