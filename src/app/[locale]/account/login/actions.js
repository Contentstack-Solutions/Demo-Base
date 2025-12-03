'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/account/login?result=invalid')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('register_email'),
    password: formData.get('register_password'),
  }

  const { data: result, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }
  else if(result?.user?.identities?.length === 0){
    redirect('/account/login?result=exists')
  }
  else{
    revalidatePath('/', 'layout')
    redirect('/account/registered')
  }
}

export async function signout(){
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}