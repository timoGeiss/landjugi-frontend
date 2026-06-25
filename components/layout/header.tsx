'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Leaf, LogIn, LogOut, User, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User as AuthUser } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/types'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/vorstand', label: 'Vorstand' },
  { href: '/programm', label: 'Programm' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/links', label: 'Links' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => setProfile(data))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'vorstandsmitglied'

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-200',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
    )}>
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[--primary] text-lg">
            <Leaf className="h-6 w-6" />
            <span className="hidden sm:block">Landjugend Untere Emme</span>
            <span className="sm:hidden">LJ Untere Emme</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5',
                  pathname.startsWith('/admin')
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-accent'
                )}
              >
                <Settings className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/portal"
                  className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md hover:bg-secondary"
                  title="Mein Bereich"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">{profile?.full_name?.split(' ')[0] ?? 'Profil'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md hover:bg-secondary"
                  title="Abmelden"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md bg-primary text-white hover:opacity-90"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Anmelden</span>
              </Link>
            )}

            <button
              className="lg:hidden p-2 rounded-md hover:bg-secondary"
              onClick={() => setOpen(!open)}
              aria-label="Navigation öffnen"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-md text-sm font-medium',
                  pathname === link.href ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md',
                  pathname.startsWith('/admin') ? 'bg-primary text-white' : 'text-primary hover:bg-accent'
                )}
              >
                <Settings className="h-4 w-4" /> Admin
              </Link>
            )}
            <div className="border-t border-border mt-2 pt-2">
              {user ? (
                <>
                  <Link href="/portal" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-md hover:bg-secondary">
                    <User className="h-4 w-4" /> Mein Bereich
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-md hover:bg-secondary w-full text-left">
                    <LogOut className="h-4 w-4" /> Abmelden
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-md bg-primary text-white">
                  <LogIn className="h-4 w-4" /> Anmelden
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
