import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, ClipboardList, FileText, Settings, LogOut, Scale } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/grades', label: 'Noten', icon: ClipboardList },
  { to: '/subjects', label: 'Fächer', icon: BookOpen },
  { to: '/reports', label: 'Berichte', icon: FileText },
  { to: '/settings', label: 'Einstellungen', icon: Settings },
]

const legal = [
  { to: '/impressum', label: 'Impressum', icon: Scale },
]

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-surface border-r border-border flex flex-col z-40">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">SG</span>
          </div>
          <span className="font-display font-semibold text-text text-base tracking-tight">SimpleGrade</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted hover:text-text hover:bg-card'
              }`
            }>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          {legal.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted hover:text-text hover:bg-card'
                }`
              }>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <NavLink to="/datenschutz"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted hover:text-text hover:bg-card'
              }`
            }>
            <Scale size={16} />
            Datenschutz
          </NavLink>
        </div>
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-muted truncate">{user?.email}</p>
        </div>
        <button onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted hover:text-grade-fail hover:bg-card transition-colors">
          <LogOut size={16} />
          Abmelden
        </button>
      </div>
    </aside>
  )
}
