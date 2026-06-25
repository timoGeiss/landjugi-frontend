import Link from 'next/link'
import { Leaf, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <Leaf className="h-5 w-5" />
              Landjugend Untere Emme
            </div>
            <p className="text-white/80 text-sm">
              Verein für junge Menschen in der Region untere Emme.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Navigation</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {[
                ['/', 'Home'],
                ['/ueber-uns', 'Über uns'],
                ['/vorstand', 'Vorstand'],
                ['/programm', 'Programm'],
                ['/galerie', 'Galerie'],
                ['/kontakt', 'Kontakt'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kontakt</h4>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@landjugend-untere-emme.ch" className="hover:text-white">
                  info@landjugend-untere-emme.ch
                </a>
              </div>
              <p>Landjugend Untere Emme<br />3400 Burgdorf</p>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <Link href="/beitreten" className="hover:text-white text-white/80">Mitglied werden</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Landjugend Untere Emme</p>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-white">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
