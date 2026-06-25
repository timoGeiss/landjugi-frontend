import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { MemberActions } from './member-actions'

export const metadata = { title: 'Mitglieder' }

const roleLabels: Record<string, string> = {
  besucher: 'Besucher/in',
  neumitglied: 'Neumitglied',
  mitglied: 'Mitglied',
  vorstandsmitglied: 'Vorstandsmitglied',
  admin: 'Admin',
}

const roleBadge: Record<string, any> = {
  besucher: 'secondary',
  neumitglied: 'warning',
  mitglied: 'success',
  vorstandsmitglied: 'default',
  admin: 'default',
}

export default async function AdminMembersPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('profiles')
    .select('*')
    .order('joined_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mitglieder ({members?.length ?? 0})</h1>
      </div>

      <div className="space-y-2">
        {members?.map(member => (
          <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-[--border] bg-[--card]">
            <div className="h-10 w-10 rounded-full bg-[--accent] flex items-center justify-center font-semibold text-[--primary] flex-shrink-0">
              {member.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{member.full_name ?? 'Kein Name'}</span>
                <Badge variant={roleBadge[member.role]}>{roleLabels[member.role]}</Badge>
                {member.label && <Badge variant="outline" className="text-xs">{member.label}</Badge>}
              </div>
              <div className="text-xs text-[--muted-foreground]">{member.email} · Beigetreten: {formatDate(member.joined_at ?? '')}</div>
            </div>
            <MemberActions member={member} />
          </div>
        ))}
      </div>
    </div>
  )
}
