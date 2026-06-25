'use client'

import { RowsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/rows.css'
import { useState } from 'react'

interface Photo {
  id: string
  url: string
  thumbnail_url: string | null
  caption: string | null
  width?: number | null
  height?: number | null
}

interface Props {
  photos: Photo[]
}

export function PhotoGrid({ photos }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const albumPhotos = photos.map(p => ({
    src: p.thumbnail_url ?? p.url,
    fullSrc: p.url,
    alt: p.caption ?? '',
    width: p.width ?? 4,
    height: p.height ?? 3,
  }))

  return (
    <>
      <RowsPhotoAlbum
        photos={albumPhotos}
        targetRowHeight={220}
        onClick={({ index }) => setLightbox(index)}
      />

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Schliessen"
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl leading-none px-3"
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.max(0, (i ?? 1) - 1)) }}
            aria-label="Zurück"
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl leading-none px-3"
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.min(albumPhotos.length - 1, (i ?? 0) + 1)) }}
            aria-label="Weiter"
          >
            ›
          </button>
          <img
            src={albumPhotos[lightbox].fullSrc}
            alt={albumPhotos[lightbox].alt}
            className="max-w-full max-h-[90vh] object-contain rounded"
            onClick={e => e.stopPropagation()}
          />
          {albumPhotos[lightbox].alt && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded">
              {albumPhotos[lightbox].alt}
            </p>
          )}
        </div>
      )}
    </>
  )
}
