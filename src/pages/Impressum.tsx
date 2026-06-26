import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Impressum() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text mb-4">
          <ArrowLeft size={12} /> Zurück
        </Link>
        <h1 className="font-display font-bold text-2xl text-text">Impressum</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">Angaben gemäss Art. 19 DSG</h2>
          <p className="text-sm text-muted">Verantwortlich für diese Webanwendung:</p>
        </section>

        <section className="space-y-1">
          <p className="text-sm text-text font-medium">SimpleGrade</p>
          <p className="text-sm text-muted">Geissbuehler Timo</p>
          <p className="text-sm text-muted">Schweiz</p>
          <p className="text-sm text-muted">
            E-Mail:{' '}
            <a href="mailto:fyberxx@gmail.com" className="text-accent hover:underline">
              fyberxx@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">Haftungsausschluss</h2>
          <p className="text-sm text-muted leading-relaxed">
            Die Inhalte dieser Webanwendung wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird jedoch keine Gewähr übernommen. Die Anwendung dient ausschliesslich der persönlichen Notenverwaltung. Eine Haftung für Schäden, die durch die Nutzung oder Nichtnutzung der bereitgestellten Informationen entstehen, ist ausgeschlossen.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">Urheberrecht</h2>
          <p className="text-sm text-muted leading-relaxed">
            Die in dieser Webanwendung enthaltenen Inhalte und Werke unterliegen dem Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">Externe Links</h2>
          <p className="text-sm text-muted leading-relaxed">
            Diese Anwendung kann Links zu externen Webseiten Dritter enthalten, auf deren Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">Drittanbieter</h2>
          <p className="text-sm text-muted leading-relaxed">
            Diese Anwendung nutzt <strong className="text-text">Supabase</strong> (Supabase Inc., 970 Toa Payoh North, Singapur) als Backend-Dienstleister für Datenbankdienste und Authentifizierung. Supabase verarbeitet Daten gemäss ihrer{' '}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Datenschutzerklärung
            </a>.
          </p>
        </section>

        <p className="text-xs text-muted border-t border-border pt-4">Stand: Juni 2026</p>
      </div>
    </div>
  )
}
