import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { AlbumForm } from './album-form'
import { AlbumActions } from './album-actions'

export const metadata = { title: 'Galerie verwalten' }

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const [{ data: albums }, { data: events }] = await Promise.all([
    supabase.from('photo_albums').select('*, photos(count)').order('created_at', { ascending: false }),
    supabase.from('events').select('id, title').eq('is_published', true).order('start_date', { ascending: false }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Galerie</h1>
        <AlbumForm events={events ?? []} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {albums?.map(album => (
          <div key={album.id} className="rounded-xl border border-[--border] bg-[--card] overflow-hidden">
            <div className="h-40 bg-[--secondary] overflow-hidden">
              {album.cover_url ? (
                <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[--muted-foreground] text-sm">Kein Cover</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{album.title}</span>
                <Badge variant={album.is_published ? 'success' : 'secondary'} className="text-xs flex-shrink-0">
                  {album.is_published ? 'Öffentlich' : 'Entwurf'}
                </Badge>
              </div>
              <div className="text-xs text-[--muted-foreground] mb-3">
                {(album.photos as any)?.[0]?.count ?? 0} Fotos
              </div>
              <AlbumActions album={album} events={events ?? []} />
            </div>
          </div>
        ))}
        {(!albums || albums.length === 0) && (
          <div className="sm:col-span-3 text-center py-12 text-[--muted-foreground] border border-dashed border-[--border] rounded-xl">
            Noch keine Alben. Erstelle das erste!
          </div>
        )}
      </div>
    </div>
  )
}
