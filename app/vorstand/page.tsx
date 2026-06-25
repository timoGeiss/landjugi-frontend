import { createClient } from '@/lib/supabase/server'
import { Mail, Phone } from 'lucide-react'
import { MemberAvatar } from '@/components/ui/member-avatar'
import { PageHeader } from '@/components/ui/page-header'

export const metadata = { title: 'Vorstand' }

export default async function VorstandPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('vorstand')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <div className="container py-16">
      <PageHeader title="Vorstand" subtitle="Das Team hinter der Landjugend Untere Emme." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members?.map(member => (
          <div key={member.id} className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <MemberAvatar imageUrl={member.image_url} name={member.full_name} />
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-2">
              {member.label}
            </div>
            <h3 className="font-semibold text-base">{member.full_name}</h3>
            <div className="mt-3 flex flex-col gap-1.5">
              {member.email && (
                <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                  <Mail className="h-3.5 w-3.5" /> {member.email}
                </a>
              )}
              {member.phone && (
                <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                  <Phone className="h-3.5 w-3.5" /> {member.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {(!members || members.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Keine Vorstandsmitglieder gefunden.</p>
        </div>
      )}
    </div>
  )
}
