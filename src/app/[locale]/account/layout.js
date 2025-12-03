
import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({ children }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
      <div className="-ml-20">
          {children}
      </div>
  );
}
