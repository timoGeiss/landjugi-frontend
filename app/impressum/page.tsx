export const metadata = { title: 'Impressum' }

export default function ImpressumPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Impressum</h1>
          <div className="h-1 w-16 bg-[--primary] rounded" />
        </div>

        <div className="prose prose-sm max-w-none space-y-6 text-[--foreground]">
          <section>
            <h2 className="text-xl font-semibold mb-2">Verantwortlich für den Inhalt</h2>
            <p className="text-[--muted-foreground]">
              Landjugend Untere Emme<br />
              3400 Burgdorf<br />
              Schweiz
            </p>
            <p className="text-[--muted-foreground] mt-2">
              E-Mail: <a href="mailto:info@landjugend-untere-emme.ch" className="text-[--primary] hover:underline">info@landjugend-untere-emme.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Vereinsstatus</h2>
            <p className="text-[--muted-foreground]">
              Die Landjugend Untere Emme ist ein eingetragener Verein nach Schweizer Recht (Art. 60 ff. ZGB).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Hosting und technischer Betrieb</h2>
            <p className="text-[--muted-foreground]">
              Diese Website wird technisch betrieben durch:<br />
              Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA
            </p>
            <p className="text-[--muted-foreground] mt-2">
              Datenbankdienste: Supabase Inc., 970 Toa Payoh North, #07-04, Singapur 318992
            </p>
            <p className="text-[--muted-foreground] mt-2">
              Medien-Speicherung: Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Haftungsausschluss</h2>
            <p className="text-[--muted-foreground]">
              Der Verein Landjugend Untere Emme übernimmt keine Haftung für die Richtigkeit, Vollständigkeit und Aktualität der auf dieser Website bereitgestellten Informationen. Für externe Links wird keine Haftung übernommen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Urheberrecht</h2>
            <p className="text-[--muted-foreground]">
              Alle auf dieser Website veröffentlichten Inhalte (Texte, Bilder, Grafiken) unterliegen dem Urheberrecht und dürfen ohne ausdrückliche schriftliche Genehmigung des Vereins nicht reproduziert werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Nutzerkonto und digitale Dienste</h2>
            <p className="text-[--muted-foreground]">
              Diese Website bietet die Möglichkeit, ein persönliches Nutzerkonto zu erstellen. Nutzer können dadurch Anlässe auf eine Merkliste setzen, Nachrichten an den Vorstand senden und Beitrittsanfragen stellen. Die Verwaltung der Nutzerkonten erfolgt durch den Vereinsvorstand. Weitere Informationen zur Datenverarbeitung finden Sie in unserer <a href="/datenschutz" className="text-[--primary] hover:underline">Datenschutzerklärung</a>.
            </p>
          </section>

          <p className="text-xs text-[--muted-foreground]">Stand: Juni 2025</p>
        </div>
      </div>
    </div>
  )
}
