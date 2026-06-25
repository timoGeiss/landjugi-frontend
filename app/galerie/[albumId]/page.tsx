import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import { PhotoGrid } from '@/components/gallery/photo-grid'

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
      <Link href="/galerie" className="inline-flex items-center gap-1.5 text-sm text-[--muted-foreground] hover:text-[--foreground] mb-8">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Galerie
      </Link>

      <div className="mb-10 pt-2">
        <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
        <div className="h-1 w-16 bg-[--primary] rounded" />
        {album.description && <p className="text-[--muted-foreground] mt-3">{album.description}</p>}
      </div>

      {photos && photos.length > 0 ? (
        <PhotoGrid photos={photos} />
      ) : (
        <p className="text-[--muted-foreground] text-center py-12">Noch keine Fotos in diesem Album.</p>
      )}
    </div>
  )
}
