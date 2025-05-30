'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace('/auth/login')
        return
      }

      // Upsert into profiles now that we have a real user ID
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        locale: session.user.user_metadata.locale || 'ja'
      })
      if (upsertError) console.error('profiles upsert error:', upsertError)

      // Then send them into profile setup
      router.replace('/profile/setup')
    })
  }, [router])

  return <p className="text-center py-20">認証処理中…そのままお待ちください。</p>
}
