import { createClient } from '@/lib/supabase/server'
import { ExternalLink } from 'lucide-react'

export const metadata = { title: 'Links' }

export default async function LinksPage() {
  const supabase = await createClient()
  const { data: links } = await supabase.from('links').select('*').order('sort_order')

  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Links</h1>
        <div className="h-1 w-16 bg-primary rounded" />
        <p className="text-muted-foreground mt-3">Nützliche Links rund um die Landjugend.</p>
      </div>

      <div className="max-w-2xl space-y-3">
        {links?.map(link => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-[--primary] hover:shadow-sm transition-all group">
            <div>
              <div className="font-medium group-hover:text-primary transition-colors">{link.title}</div>
              {link.description && <div className="text-sm text-muted-foreground">{link.description}</div>}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
          </a>
        ))}
        {(!links || links.length === 0) && (
          <p className="text-muted-foreground text-center py-12">Keine Links vorhanden.</p>
        )}
      </div>
    </div>
  )
}
