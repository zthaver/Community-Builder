'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';

export type FormState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

/* =========================
   LOGIN
========================= */
// actions.ts
export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const fieldErrors: Record<string, string> = {};

  // Basic required field check
  if (!email) fieldErrors.email = 'Email is required';
  if (!password) fieldErrors.password = 'Password is required';

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the errors', fieldErrors };
  }

  const { data: userData, error: signInError } = await supabase.auth.signInWithPassword({ email, password }).then(res => res);

  if (signInError || !userData.user) {
    // ❌ Outline both email and password as invalid
    return { 
      error: 'Invalid login', 
      fieldErrors: {
        email: 'Invalid email or password',
        password: 'Invalid email or password'
      }
    };
  }

  // ✅ Redirect after successful login
  redirect('/home'); 
}
``

/* =========================
   SIGNUP
========================= */
export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Name is required';
  if (!email) fieldErrors.email = 'Email is required';
  if (!password) fieldErrors.password = 'Password is required';
  if (!role) fieldErrors.role = 'Role is required';

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the errors', fieldErrors };
  }

  const { data: userData, error: signupError } = await supabase.auth.signUp({ email, password });

  if (signupError) {
    return { error: 'Signup failed', fieldErrors: { email: signupError.message } };
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { error: errorInsert } = await supabase
    .from('users')
    .insert({ id: user?.id, name, email, role });

  if (errorInsert) {
    return { error: 'Failed to save user', fieldErrors: { email: 'Email may already be registered' } };
  }

  redirect('/');
}
