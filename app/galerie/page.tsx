import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Camera, Image as ImageIcon } from 'lucide-react'
import { AlbumCover } from '@/components/ui/album-cover'
import { PageHeader } from '@/components/ui/page-header'

export const metadata = { title: 'Galerie' }

export default async function GaleriePage() {
  const supabase = await createClient()
  const { data: albums } = await supabase
    .from('photo_albums')
    .select('*, photos(count)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="container py-16">
      <PageHeader title="Galerie" subtitle="Eindrücke aus unseren Anlässen und Aktivitäten." />

      {albums && albums.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map(album => (
            <Link key={album.id} href={`/galerie/${album.id}`}
              className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
              <div className="overflow-hidden bg-gray-100">
                {album.cover_url ? (
                  <AlbumCover
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
                    <Camera className="h-12 w-12 text-primary opacity-20" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                  {album.title}
                </h3>
                {album.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <ImageIcon className="h-3 w-3" />
                  {(album.photos as any)?.[0]?.count ?? 0} Fotos
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Camera className="h-14 w-14 mx-auto mb-3 opacity-20" />
          <p>Noch keine Alben vorhanden.</p>
        </div>
      )}
    </div>
  )
}
