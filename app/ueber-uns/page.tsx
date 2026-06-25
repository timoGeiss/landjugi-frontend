import { createClient } from '@/lib/supabase/server'
import { Leaf, Users, Heart, Mountain } from 'lucide-react'

export const metadata = { title: 'Über uns' }

export default async function UeberUnsPage() {
  const supabase = await createClient()
  const { data: content } = await supabase.from('site_content').select('key, value')
  const get = (key: string) => content?.find(c => c.key === key)?.value ?? ''

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">{get('about_title') || 'Über uns'}</h1>
          <div className="h-1 w-16 bg-primary rounded" />
        </div>

        <div className="prose prose-sm max-w-none mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {get('about_text')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Leaf, title: 'Natur & Heimat', text: 'Wir fühlen uns der Natur und unserer Region verbunden. Gemeinsame Aktivitäten im Freien prägen unseren Verein.' },
            { icon: Users, title: 'Gemeinschaft', text: 'Freundschaft und Zusammenhalt stehen bei uns im Mittelpunkt. Wir sind füreinander da.' },
            { icon: Heart, title: 'Engagement', text: 'Wir engagieren uns für unsere Region und tragen zur lebendigen Dorfgemeinschaft bei.' },
            { icon: Mountain, title: 'Abenteuer', text: 'Gemeinsame Ausflüge, Lager und besondere Erlebnisse – bei uns ist immer etwas los!' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Mitglied werden?</h2>
          <p className="text-muted-foreground mb-4">
            Du bist zwischen 14 und 30 Jahren alt und wohnst in der Region Untere Emme? Wir freuen uns auf dich!
          </p>
          <a href="/beitreten" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[--primary] text-white font-medium hover:bg-[--primary]/90 transition-colors">
            Jetzt Beitrittsanfrage stellen
          </a>
        </div>
      </div>
    </div>
  )
}
