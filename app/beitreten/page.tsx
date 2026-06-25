'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { CheckCircle, UserPlus } from 'lucide-react'

export default function BeiretenPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', birth_year: '', message: '' })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email) {
      toast.error('Bitte Name und E-Mail ausfüllen.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('join_requests').insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      message: form.message || null,
    })
    setLoading(false)
    if (error) {
      if (error.message?.includes('duplicate') || error.code === '23505') {
        toast.error('Du hast bereits eine Anfrage gestellt.')
      } else {
        toast.error('Fehler beim Senden. Bitte versuche es erneut.')
      }
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="container py-16">
      <div className="max-w-lg mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Mitglied werden</h1>
          <div className="h-1 w-16 bg-primary rounded" />
          <p className="text-muted-foreground mt-3">
            Fülle das Formular aus und wir melden uns bei dir!
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-12 space-y-4 border border-border rounded-xl">
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold">Anfrage gesendet!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Vielen Dank für dein Interesse! Wir werden deine Anfrage prüfen und uns bald bei dir melden.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 border border-border rounded-xl p-6 bg-card">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Name *</Label>
              <Input id="full_name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Vor- und Nachname" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-Mail *</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="deine@email.ch" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+41 ..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birth_year">Jahrgang</Label>
                <Input id="birth_year" type="number" value={form.birth_year} onChange={e => setForm(f => ({ ...f, birth_year: e.target.value }))} placeholder="z.B. 2000" min={1990} max={2015} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Nachricht (optional)</Label>
              <Textarea id="message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Wie bist du auf uns aufmerksam geworden? Hast du noch Fragen?" rows={4} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <UserPlus className="h-4 w-4" />
              {loading ? 'Wird gesendet...' : 'Beitrittsanfrage senden'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Mit dem Absenden stimmst du unserer{' '}
              <a href="/datenschutz" className="underline">Datenschutzerklärung</a> zu.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
