import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('de-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
    ...opts,
  })
}

export function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function isPastEvent(date: string) {
  return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))
}
