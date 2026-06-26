import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Bestätigungs-E-Mail gesendet. Bitte prüfe dein Postfach.')
    }
    setLoading(false)
  }

  const inputClass = 'w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors'

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 shadow-lg shadow-accent/30">
            <span className="font-display font-bold text-white text-2xl">SG</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-text">SimpleGrade</h1>
          <p className="text-muted text-sm mt-1">Dein Schweizer Notentracker</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
          {/* Toggle */}
          <div className="flex bg-surface rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'
                }`}>
                {m === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="E-Mail-Adresse" className={inputClass} required
            />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Passwort" className={inputClass} required minLength={6}
            />

            {error && <p className="text-grade-fail text-xs px-1">{error}</p>}
            {message && <p className="text-grade-6 text-xs px-1">{message}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-display font-semibold text-sm hover:bg-accent-hover disabled:opacity-60 transition-colors shadow-lg shadow-accent/20 mt-2">
              {loading ? '…' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Mit der Anmeldung akzeptierst du unsere{' '}
          <a href="/datenschutz" className="underline hover:text-text">Datenschutzerklärung</a>
        </p>
      </div>
    </div>
  )
}
