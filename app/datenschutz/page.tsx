export const metadata = { title: 'Datenschutzerklärung' }

export default function DatenschutzPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Datenschutzerklärung</h1>
          <div className="h-1 w-16 bg-[--primary] rounded" />
        </div>

        <div className="space-y-8 text-[--foreground]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Verantwortliche Stelle</h2>
            <p className="text-[--muted-foreground]">
              Landjugend Untere Emme, 3400 Burgdorf, Schweiz<br />
              E-Mail: <a href="mailto:info@landjugend-untere-emme.ch" className="text-[--primary] hover:underline">info@landjugend-untere-emme.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Erhobene Daten und Zweck</h2>
            <div className="space-y-3 text-[--muted-foreground]">
              <p><strong className="text-[--foreground]">Nutzerkonto:</strong> Bei der Registrierung erheben wir Name, E-Mail-Adresse und ein verschlüsseltes Passwort. Diese Daten werden ausschliesslich für den Betrieb des Nutzerkontos verwendet.</p>
              <p><strong className="text-[--foreground]">Beitrittsanfragen:</strong> Name, E-Mail, Telefon (optional), Jahrgang (optional) und eine optionale Nachricht. Diese dienen der Prüfung und Bearbeitung von Mitgliedschaftsanfragen.</p>
              <p><strong className="text-[--foreground]">Kontaktformular:</strong> Name, E-Mail, Betreff und Nachrichtentext. Diese Daten werden ausschliesslich zur Beantwortung Ihrer Anfrage genutzt.</p>
              <p><strong className="text-[--foreground]">Merkliste:</strong> Gemerkter Anlässe werden dem Nutzerkonto zugeordnet gespeichert.</p>
              <p><strong className="text-[--foreground]">Besucherstatistiken:</strong> Es werden anonymisierte Seitenaufrufe (aufgerufene Seite, ungefähre Herkunft) für statistische Zwecke erfasst. Es werden keine IP-Adressen vollständig gespeichert.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Rechtsgrundlage</h2>
            <p className="text-[--muted-foreground]">
              Die Datenbearbeitung erfolgt auf Grundlage des Schweizer Datenschutzgesetzes (revDSG). Für Nutzer aus der EU findet zusätzlich die DSGVO Anwendung (Art. 6 Abs. 1 lit. b und f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Weitergabe an Dritte</h2>
            <p className="text-[--muted-foreground]">
              Ihre Daten werden nicht an unbefugte Dritte weitergegeben. Zur technischen Bereitstellung dieser Website setzen wir folgende Dienstleister ein, mit denen Auftragsverarbeitungsverträge bestehen:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[--muted-foreground]">
              <li><strong className="text-[--foreground]">Vercel Inc.</strong> (USA) – Hosting der Website</li>
              <li><strong className="text-[--foreground]">Supabase Inc.</strong> (Singapur/EU) – Datenbankdienste und Authentifizierung</li>
              <li><strong className="text-[--foreground]">Cloudflare, Inc.</strong> (USA) – CDN, DNS und Bildspeicherung (R2)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Datenspeicherung und -löschung</h2>
            <p className="text-[--muted-foreground]">
              Personenbezogene Daten werden nur so lange gespeichert, wie dies für die genannten Zwecke erforderlich ist. Nutzerkonten können jederzeit durch den Vorstand oder auf Anfrage gelöscht werden. Bitte kontaktieren Sie uns dazu per E-Mail.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Ihre Rechte</h2>
            <p className="text-[--muted-foreground]">
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Wenden Sie sich dazu an <a href="mailto:info@landjugend-untere-emme.ch" className="text-[--primary] hover:underline">info@landjugend-untere-emme.ch</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
            <p className="text-[--muted-foreground]">
              Diese Website verwendet ausschliesslich funktionale Cookies für die Sitzungsverwaltung (Anmeldestatus). Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Sicherheit</h2>
            <p className="text-[--muted-foreground]">
              Passwörter werden niemals im Klartext gespeichert. Die Übertragung erfolgt ausschliesslich verschlüsselt über HTTPS. Wir setzen aktuelle Sicherheitsstandards (OWASP) ein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Kontakt bei Datenschutzfragen</h2>
            <p className="text-[--muted-foreground]">
              Bei Fragen zum Datenschutz wenden Sie sich an:<br />
              <a href="mailto:info@landjugend-untere-emme.ch" className="text-[--primary] hover:underline">info@landjugend-untere-emme.ch</a>
            </p>
          </section>

          <p className="text-xs text-[--muted-foreground]">Stand: Juni 2025</p>
        </div>
      </div>
    </div>
  )
}
