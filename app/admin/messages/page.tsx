import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { MessageActions } from './message-actions'

export const metadata = { title: 'Nachrichten' }

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  const unread = messages?.filter(m => !m.is_read) ?? []
  const read = messages?.filter(m => m.is_read) ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nachrichten</h1>

      {unread.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Ungelesen ({unread.length})
          </h2>
          <div className="space-y-3">
            {unread.map(msg => <MessageCard key={msg.id} message={msg} />)}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-[--muted-foreground]">Gelesen</h2>
          <div className="space-y-3 opacity-75">
            {read.map(msg => <MessageCard key={msg.id} message={msg} />)}
          </div>
        </section>
      )}

      {(!messages || messages.length === 0) && (
        <div className="text-center py-12 text-[--muted-foreground] border border-dashed border-[--border] rounded-xl">
          Keine Nachrichten.
        </div>
      )}
    </div>
  )
}

function MessageCard({ message }: { message: any }) {
  return (
    <div className="p-5 rounded-xl border border-[--border] bg-[--card]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold">{message.subject}</span>
            {!message.is_read && <Badge variant="default" className="text-xs">Neu</Badge>}
            {message.reply && <Badge variant="success" className="text-xs">Beantwortet</Badge>}
          </div>
          <div className="text-sm text-[--muted-foreground] mb-2">
            Von: {message.sender_name} ({message.sender_email}) · {formatDate(message.created_at)}
          </div>
          <p className="text-sm bg-[--secondary] p-3 rounded-md">{message.body}</p>
          {message.reply && (
            <div className="mt-2 p-3 rounded-md bg-[--accent] text-sm">
              <span className="font-medium text-[--accent-foreground]">Antwort: </span>
              {message.reply}
            </div>
          )}
        </div>
        <MessageActions message={message} />
      </div>
    </div>
  )
}
