import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, X } from 'lucide-react'

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params
  const supabase = await createClient()

  const [{ data: album }, { data: photos }] = await Promise.all([
    supabase.from('photo_albums').select('*').eq('id', albumId).eq('is_published', true).single(),
    supabase.from('photos').select('*').eq('album_id', albumId).order('sort_order'),
  ])

  if (!album) notFound()

  return (
    <div className="container py-12">
      <Link href="/galerie" className="inline-flex items-center gap-1.5 text-sm text-[--muted-foreground] hover:text-[--foreground] mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Galerie
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
        <div className="h-1 w-16 bg-[--primary] rounded" />
        {album.description && <p className="text-[--muted-foreground] mt-3">{album.description}</p>}
      </div>

      {photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="group aspect-square rounded-lg overflow-hidden bg-[--secondary] cursor-pointer">
              <img
                src={photo.thumbnail_url ?? photo.url}
                alt={photo.caption ?? ''}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[--muted-foreground] text-center py-12">Noch keine Fotos in diesem Album.</p>
      )}
    </div>
  )
}
