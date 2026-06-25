import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, CalendarDays, Camera, Users, UserCheck, MessageSquare, FileText, Settings, Leaf, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Anlässe', icon: CalendarDays },
  { href: '/admin/gallery', label: 'Galerie', icon: Camera },
  { href: '/admin/members', label: 'Mitglieder', icon: Users },
  { href: '/admin/requests', label: 'Beitrittsanfragen', icon: UserCheck },
  { href: '/admin/messages', label: 'Nachrichten', icon: MessageSquare },
  { href: '/admin/content', label: 'Inhalt', icon: FileText },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (!profile || !['vorstandsmitglied', 'admin'].includes(profile.role)) redirect('/?error=unauthorized')

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-[--border] bg-[--card] shrink-0">
        <div className="p-4 border-b border-[--border]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[--primary]">
            <Leaf className="h-4 w-4" />
            Admin-Bereich
          </div>
          <div className="text-xs text-[--muted-foreground] mt-0.5">{profile.full_name}</div>
        </div>
        <nav className="p-3 flex flex-col gap-0.5 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <AdminNavLink key={href} href={href} label={label} icon={Icon} />
          ))}
        </nav>
        <div className="p-3 border-t border-[--border]">
          <Link href="/" className="flex items-center gap-2 text-xs text-[--muted-foreground] hover:text-[--foreground] px-2 py-1.5">
            <ChevronRight className="h-3 w-3 rotate-180" /> Zur Website
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden w-full border-b border-[--border] bg-[--card] px-4 py-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm hover:bg-[--secondary] whitespace-nowrap">
              <Icon className="h-3.5 w-3.5" /> {label}
            </Link>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 overflow-auto bg-[--background]">{children}</main>
    </div>
  )
}

function AdminNavLink({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm hover:bg-[--secondary] text-[--foreground] transition-colors">
      <Icon className="h-4 w-4 text-[--muted-foreground]" />
      {label}
    </Link>
  )
}
