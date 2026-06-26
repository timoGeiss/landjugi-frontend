import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Datenschutz() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text mb-4">
          <ArrowLeft size={12} /> Zurück
        </Link>
        <h1 className="font-display font-bold text-2xl text-text">Datenschutzerklärung</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-sm">
        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">1. Verantwortliche Stelle</h2>
          <p className="text-muted leading-relaxed">
            Verantwortlich für die Verarbeitung personenbezogener Daten im Sinne des Schweizer Datenschutzgesetzes (DSG) und der DSGVO ist:
          </p>
          <div className="mt-2 p-3 bg-surface rounded-lg">
            <p className="text-text">Geissbuehler Timo · SimpleGrade</p>
            <p className="text-muted">E-Mail: <a href="mailto:fyberxx@gmail.com" className="text-accent hover:underline">fyberxx@gmail.com</a></p>
          </div>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">2. Welche Daten werden erhoben</h2>
          <ul className="text-muted leading-relaxed space-y-1 list-disc list-inside">
            <li><strong className="text-text">Kontodaten:</strong> E-Mail-Adresse und Passwort-Hash bei der Registrierung</li>
            <li><strong className="text-text">Schuldaten:</strong> Fächer, Schuljahre und Noten, die du manuell erfasst</li>
            <li><strong className="text-text">Nutzungsdaten:</strong> Technische Zugriffsdaten (IP-Adresse, Zeitstempel) durch Supabase</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">3. Zweck der Verarbeitung</h2>
          <ul className="text-muted leading-relaxed space-y-1 list-disc list-inside">
            <li>Bereitstellung der Notentracking-Funktionen</li>
            <li>Authentifizierung und Sicherung des Nutzerkontos</li>
            <li>Generierung von Berichten und PDF-Exporten</li>
          </ul>
          <p className="text-muted mt-2">Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) / berechtigtes Interesse.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">4. Datenspeicherung und Aufbewahrung</h2>
          <p className="text-muted leading-relaxed">
            Alle Daten werden verschlüsselt auf Servern von <strong className="text-text">Supabase</strong> in der Region <strong className="text-text">EU-West (Irland)</strong> gespeichert. Daten werden so lange aufbewahrt, wie das Konto aktiv ist. Bei Kontolöschung werden alle personenbezogenen Daten innerhalb von 30 Tagen gelöscht.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">5. Datenweitergabe</h2>
          <p className="text-muted leading-relaxed">
            Eine Weitergabe deiner Daten an Dritte erfolgt nicht, ausser:
          </p>
          <ul className="text-muted leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li><strong className="text-text">Supabase Inc.</strong> als Auftragsverarbeiter (Datenbankdienste)</li>
            <li>Bei gesetzlicher Verpflichtung (behördliche Anordnung)</li>
          </ul>
          <p className="text-muted mt-2">
            Supabase verarbeitet Daten gemäss dem EU-US Data Privacy Framework.
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">Supabase-Datenschutz</a>
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">6. WebUntis (optional)</h2>
          <p className="text-muted leading-relaxed">
            Falls du die optionale WebUntis-Importfunktion verwendest, werden deine WebUntis-Zugangsdaten <strong className="text-text">ausschliesslich im Browser</strong> für den einmaligen Importvorgang verwendet und <strong className="text-text">nicht gespeichert</strong>. Die Verbindung zum WebUntis-Server deiner Schule erfolgt direkt aus deinem Browser heraus.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">7. Deine Rechte</h2>
          <p className="text-muted mb-2">Gemäss DSG und DSGVO hast du folgende Rechte:</p>
          <ul className="text-muted leading-relaxed space-y-1 list-disc list-inside">
            <li>Auskunft über gespeicherte Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung deiner Daten («Recht auf Vergessenwerden»)</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenportabilität</li>
            <li>Widerspruch gegen die Verarbeitung</li>
          </ul>
          <p className="text-muted mt-2">
            Anfragen bitte per E-Mail an:{' '}
            <a href="mailto:fyberxx@gmail.com" className="text-accent hover:underline">fyberxx@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">8. Cookies und lokale Speicherung</h2>
          <p className="text-muted leading-relaxed">
            Diese Anwendung verwendet <strong className="text-text">localStorage</strong> für die Speicherung der Sitzung (Auth-Token von Supabase). Es werden keine Tracking-Cookies oder Analyse-Tools eingesetzt.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-text mb-2">9. Datenschutzbeauftragter</h2>
          <p className="text-muted leading-relaxed">
            Bei Fragen zum Datenschutz oder zur Ausübung deiner Rechte wende dich direkt an den Verantwortlichen (siehe Abschnitt 1).
          </p>
        </section>

        <p className="text-xs text-muted border-t border-border pt-4">Stand: Juni 2026 · Diese Erklärung gilt für simplegrade.local und alle lokalen Entwicklungsumgebungen.</p>
      </div>
    </div>
  )
}
