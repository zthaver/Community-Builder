'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server'

let id = 0;

export async function login(formData: FormData) {
  const supabase = await createClient();

  let roleData = "senior";
  // type-casting here for convenience
  // in practice, you should validate your inputs
  // note to self: use yup/formik for form validation

  // add error handling
  const loginData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }


  //const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";


  const { data: userData, error:signInError } = await supabase.auth.signInWithPassword(loginData)

  console.log(userData);
  console.log(signInError);
  console.log(loginData.email)

  const { data, error } = await supabase
  .from('users')
  .select('role')

  roleData = data![0].role;
  console.log(data![0].role);
  console.log(error);

  
 


  if (roleData == "moderator") {
    redirect("/blog");
  }
  if (roleData == "familymember") {
    //redirect("/moderator");
  }
  if (roleData == "familymember") {
    //redirect("/moderator");
  }


  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath('/home', 'layout')
  redirect('/home')
}

export async function signup(formData: FormData) {
  

  const signUpData = {
    email: formData.get('email') as string,
    name: formData.get('name') as string,
    password: formData.get('password') as string,
    role: formData.get("role") as string,
  }
  
  const supabase = await createClient();
  const { error: errorSignup, data: userData } = await supabase.auth.signUp(signUpData);
  


  if (errorSignup) {
    console.log("error" + errorSignup.message);
    redirect('/error')
  }

  else  {
    //const supabase = await createClient("");
    const { data: { session }, error } = await supabase.auth.getSession();
    const { data: insertedData, error: errorInsert } = await supabase
      .from('users')
      .insert({
        id: userData?.user?.id, // UUID from auth
        name: signUpData.name,
        email:signUpData.email,
        role:signUpData.role,
      });
      
 redirect('/home ')
  }


}