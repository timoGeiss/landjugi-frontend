import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from './content-editor'
import { VorstandEditor } from './vorstand-editor'

export const metadata = { title: 'Inhalt verwalten' }

export default async function AdminContentPage() {
  const supabase = await createClient()
  const [{ data: content }, { data: vorstand }] = await Promise.all([
    supabase.from('site_content').select('*'),
    supabase.from('vorstand').select('*').order('sort_order'),
  ])

  const contentMap = Object.fromEntries(content?.map(c => [c.key, c.value]) ?? [])

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-6">Inhalt bearbeiten</h1>
        <ContentEditor initialContent={contentMap} />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4">Vorstand verwalten</h2>
        <VorstandEditor members={vorstand ?? []} />
      </section>
    </div>
  )
}
