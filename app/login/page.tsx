'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Leaf, LogIn } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error('Ungültige E-Mail oder Passwort.')
      return
    }
    router.push(redirect)
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.ch" required autoFocus />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Passwort</Label>
        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        <LogIn className="h-4 w-4" />
        {loading ? 'Anmelden...' : 'Anmelden'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[--accent] mb-4">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Anmelden</h1>
          <p className="text-muted-foreground text-sm mt-1">Landjugend Untere Emme</p>
        </div>
        <div className="border border-border rounded-xl p-6 bg-white">
          <Suspense>
            <LoginForm />
          </Suspense>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">Registrieren</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
