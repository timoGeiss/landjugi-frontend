'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Leaf, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwörter stimmen nicht überein.'); return }
    if (form.password.length < 8) { toast.error('Passwort muss mindestens 8 Zeichen haben.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Konto erstellt! Bitte bestätige deine E-Mail.')
    router.push('/login')
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[--accent] mb-4">
            <Leaf className="h-6 w-6 text-[--primary]" />
          </div>
          <h1 className="text-2xl font-bold">Registrieren</h1>
          <p className="text-[--muted-foreground] text-sm mt-1">Erstelle dein Konto</p>
        </div>
        <div className="border border-[--border] rounded-xl p-6 bg-[--card]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Vor- und Nachname" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="deine@email.ch" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Passwort</Label>
              <Input id="pw" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 Zeichen" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Passwort bestätigen</Label>
              <Input id="confirm" type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <UserPlus className="h-4 w-4" />
              {loading ? 'Wird erstellt...' : 'Konto erstellen'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-[--muted-foreground]">
            Bereits ein Konto?{' '}
            <Link href="/login" className="text-[--primary] hover:underline font-medium">Anmelden</Link>
          </div>
          <p className="text-xs text-[--muted-foreground] text-center mt-3">
            Mit der Registrierung stimmst du der{' '}
            <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> zu.
          </p>
        </div>
      </div>
    </div>
  )
}
