'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function changePassword(formData) {
    const supabase = await createClient()

    const passwords = {
      password: formData.get('password'),
    }

    const { error } = await supabase.auth.updateUser({ password: passwords.password })

    if(error){
        redirect('/error');
    }

    revalidatePath('/', 'layout')
    redirect('/account/login')
}