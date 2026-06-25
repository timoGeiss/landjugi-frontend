import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, isPastEvent } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Users, Camera, ArrowRight, MapPin } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: events }, { data: content }] = await Promise.all([
    supabase.from('events').select('*').eq('is_published', true)
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date').limit(3),
    supabase.from('site_content').select('key, value'),
  ])

  const get = (key: string) => content?.find(c => c.key === key)?.value ?? ''

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a4d1a] via-[#2d6a2d] to-[#3d8c3d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container py-24 relative">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-0">
              Willkommen
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {get('welcome_title') || 'Landjugend Untere Emme'}
            </h1>
            <p className="text-xl text-white/85 mb-8">
              {get('welcome_subtitle') || 'Zusammen erleben, gemeinsam wachsen – Jugend auf dem Land.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-white text-[--primary] hover:bg-white/90">
                <Link href="/programm">Programm ansehen</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/50 text-white hover:bg-white/10">
                <Link href="/beitreten">Mitglied werden</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[--accent] border-y border-[--border]">
        <div className="container py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Users, label: 'Mitglieder', value: '50+' },
              { icon: CalendarDays, label: 'Anlässe pro Jahr', value: '20+' },
              { icon: Camera, label: 'Fotos', value: '500+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="h-5 w-5 text-[--primary]" />
                <div className="text-2xl font-bold text-[--primary]">{value}</div>
                <div className="text-sm text-[--muted-foreground]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Nächste Anlässe</h2>
            <p className="text-[--muted-foreground] mt-1">Was steht bei uns an?</p>
          </div>
          <Link href="/programm" className="flex items-center gap-1 text-sm text-[--primary] hover:underline font-medium">
            Alle anzeigen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {events && events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow overflow-hidden">
                {event.image_url && (
                  <div className="h-40 bg-[--secondary] overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                {!event.image_url && (
                  <div className="h-40 bg-gradient-to-br from-[--accent] to-[--secondary] flex items-center justify-center">
                    <CalendarDays className="h-12 w-12 text-[--primary]/30" />
                  </div>
                )}
                <CardContent className="pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-[--muted-foreground] mb-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(event.start_date)}
                  </div>
                  <h3 className="font-semibold text-base mb-1 line-clamp-2">{event.title}</h3>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
                      <MapPin className="h-3 w-3" /> {event.location}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-10 text-center text-[--muted-foreground]">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Aktuell sind keine Anlässe geplant. Schau bald wieder rein!</p>
          </Card>
        )}
      </section>

      {/* About teaser */}
      <section className="bg-[--secondary] border-y border-[--border]">
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">{get('about_title') || 'Über uns'}</h2>
            <p className="text-[--muted-foreground] leading-relaxed mb-6">
              {get('about_text')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/ueber-uns">Mehr erfahren</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/beitreten">Jetzt beitreten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Galerie</h2>
            <p className="text-[--muted-foreground] mt-1">Eindrücke aus unseren Anlässen</p>
          </div>
          <Link href="/galerie" className="flex items-center gap-1 text-sm text-[--primary] hover:underline font-medium">
            Alle Fotos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-[--accent] to-[--secondary] flex items-center justify-center">
              <Camera className="h-8 w-8 text-[--primary]/20" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[--primary] text-white">
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-3">Werde Teil der Landjugend!</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Lerne neue Leute kennen, erlebe gemeinsame Abenteuer und sei dabei!
          </p>
          <Button size="lg" asChild className="bg-white text-[--primary] hover:bg-white/90">
            <Link href="/beitreten">Beitrittsanfrage stellen</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
