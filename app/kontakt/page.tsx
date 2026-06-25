'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react'

export default function KontaktPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.body) {
      toast.error('Bitte alle Felder ausfüllen.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('messages').insert({
      sender_id: user?.id,
      sender_name: form.name,
      sender_email: form.email,
      subject: form.subject,
      body: form.body,
    })
    setLoading(false)
    if (error) {
      toast.error('Fehler beim Senden. Bitte versuche es erneut.')
      return
    }
    setSent(true)
    toast.success('Nachricht gesendet!')
  }

  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Kontakt</h1>
        <div className="h-1 w-16 bg-primary rounded" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-4xl">
        <div>
          <h2 className="text-lg font-semibold mb-4">Schreib uns!</h2>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-medium">Deine Nachricht wurde gesendet!</p>
              <p className="text-sm text-muted-foreground">Wir melden uns so schnell wie möglich bei dir.</p>
              <Button variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', body: '' }) }}>
                Weitere Nachricht senden
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Dein Name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="deine@email.ch" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Betreff</Label>
                <Input id="subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Worum geht es?" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body">Nachricht</Label>
                <Textarea id="body" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Deine Nachricht..." rows={5} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                <Send className="h-4 w-4" />
                {loading ? 'Wird gesendet...' : 'Nachricht senden'}
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Kontaktdaten</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-medium">E-Mail</div>
                  <a href="mailto:info@landjugend-untere-emme.ch" className="text-muted-foreground text-sm hover:text-primary">
                    info@landjugend-untere-emme.ch
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Adresse</div>
                  <p className="text-muted-foreground text-sm">Landjugend Untere Emme<br />3400 Burgdorf</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent rounded-xl p-6">
            <h3 className="font-semibold mb-2">Mitglied werden?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Du möchtest der Landjugend beitreten? Fülle unser Beitrittsformular aus!
            </p>
            <a href="/beitreten" className="text-sm text-primary font-medium hover:underline">
              Beitrittsanfrage stellen →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
