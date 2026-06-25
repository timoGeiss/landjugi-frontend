import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { RequestActions } from './request-actions'

export const metadata = { title: 'Beitrittsanfragen' }

export default async function AdminRequestsPage() {
  const supabase = await createClient()
  const { data: requests } = await supabase
    .from('join_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const pending = requests?.filter(r => r.status === 'pending') ?? []
  const handled = requests?.filter(r => r.status !== 'pending') ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Beitrittsanfragen</h1>

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Offen ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(req => <RequestCard key={req.id} request={req} />)}
          </div>
        </section>
      )}

      {handled.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-[--muted-foreground]">Bearbeitet</h2>
          <div className="space-y-3 opacity-75">
            {handled.map(req => <RequestCard key={req.id} request={req} />)}
          </div>
        </section>
      )}

      {(!requests || requests.length === 0) && (
        <div className="text-center py-12 text-[--muted-foreground] border border-dashed border-[--border] rounded-xl">
          Noch keine Beitrittsanfragen.
        </div>
      )}
    </div>
  )
}

function RequestCard({ request }: { request: any }) {
  const statusVariant: Record<string, any> = { pending: 'warning', approved: 'success', rejected: 'destructive' }
  const statusLabel: Record<string, string> = { pending: 'Offen', approved: 'Angenommen', rejected: 'Abgelehnt' }

  return (
    <div className="p-5 rounded-xl border border-[--border] bg-[--card]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{request.full_name}</span>
            <Badge variant={statusVariant[request.status]}>{statusLabel[request.status]}</Badge>
          </div>
          <div className="text-sm text-[--muted-foreground] space-y-0.5">
            <div>{request.email}{request.phone && ` · ${request.phone}`}</div>
            {request.birth_year && <div>Jahrgang {request.birth_year}</div>}
            <div>Eingegangen: {formatDate(request.created_at)}</div>
          </div>
          {request.message && (
            <p className="mt-2 text-sm bg-[--secondary] p-3 rounded-md">{request.message}</p>
          )}
          {request.admin_note && (
            <p className="mt-2 text-sm text-[--muted-foreground] italic">Admin-Notiz: {request.admin_note}</p>
          )}
        </div>
        {request.status === 'pending' && <RequestActions request={request} />}
      </div>
    </div>
  )
}
