'use client'
import { useState } from 'react'
import { User } from 'lucide-react'

interface Props {
  imageUrl: string | null
  name: string
}

export function MemberAvatar({ imageUrl, name }: Props) {
  const [error, setError] = useState(false)
  const valid = imageUrl && imageUrl.startsWith('http') && !error

  return (
    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
      {valid ? (
        <img
          src={imageUrl!}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <User className="h-10 w-10 text-primary opacity-50" />
      )}
    </div>
  )
}
