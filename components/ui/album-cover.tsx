'use client'
import { useState } from 'react'
import { Camera } from 'lucide-react'

interface Props {
  src: string
  alt: string
  className?: string
}

export function AlbumCover({ src, alt, className }: Props) {
  const [error, setError] = useState(false)

  const isValidUrl = src.startsWith('http')

  if (!isValidUrl || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
        <Camera className="h-12 w-12 text-primary opacity-20" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
