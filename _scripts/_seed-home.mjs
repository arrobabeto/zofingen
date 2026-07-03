// Seeds the Zofingen Treuhand Home page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 7:234) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-home.mjs
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const env = Object.fromEntries(
  readFileSync(join(root, ".env"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]
    }),
)

const URL = env.ORBITYPE_API_SQL_URL
const KEY = env.ORBITYPE_API_SQL_KEY
const img = (name) => `/img/home/${name}`

const sections = [
  {
    title: "Treuhand & Steuerberatung in Zofingen",
    subtitle: "Effizient, persönlich und zuverlässig",
    body: "Zofingen Treuhand AG bietet Ihnen massgeschneiderte Treuhanddienstleistungen wie digitale Buchhaltung, Lohnbuchhaltung und Steuerberatung für KMUs. Mit unserer Kombination aus persönlicher Betreuung und digitaler Effizienz entlasten wir Sie bei administrativen Aufgaben und optimieren Ihre Finanzprozesse.",
    ctaLabel: "Beratungsgespräch vereinbaren",
    ctaHref: "#kontakt",
    image: img("hero-bg.png"),
    _orbi: { component: "SectionHero" },
  },
  {
    cards: [
      {
        title: "Persönliche Betreuung",
        body: "Sie erhalten einen festen Ansprechpartner, der Ihre Anliegen individuell und zuverlässig betreut.",
      },
      {
        title: "Geprüfte Innovation",
        body: "Unsere Cloud-basierte Lösung ermöglicht 24/7 Zugriff auf Ihre Finanzdokumente.",
      },
      {
        title: "Absolute Verlässlichkeit",
        body: "Wir bieten Ihnen rechtliche Sicherheit und fehlerfreie Finanzprozesse – ohne Wenn und Aber.",
      },
    ],
    _orbi: { component: "SectionFeatureCards" },
  },
  {
    title: "Ihre Bedürfnisse\nUnsere Lösungen",
    body: "Suchen Sie nach einem Treuhänder in der Schweiz, der mit Ihren persönlichen Überzeugungen und Werten übereinstimmt?\n\nDer Sie kompetent und zuverlässig in allen finanziellen Belangen unterstützt?\n\nWir bieten Ihnen massgeschneiderte Treuhandlösungen für KMUs, um rechtliche Risiken zu vermeiden und Ihre Finanzen digital und effizient zu managen.",
    image: img("loesungen.jpg"),
    _orbi: { component: "SectionTextMedia" },
  },
  {
    title: "BILANZ Top Steuerexperten\nTreuhänder 2026",
    images: [img("cert-bilanz.png"), img("cert-top2025.png"), img("cert-urkunde.png")],
    body: "BILANZ Top Steuerexperten & Treuhänder 2026.\nWir sind stolz, bekannt zu geben, dass die Zofingen Treuhand AG von der Zeitschrift Bilanz erneut als einer der Top Steuerberatungs- und Treuhandgesellschaften der Schweiz 2026 ausgezeichnet wurde. Diese Auszeichnung in der Kategorie bis 9 Mitarbeitende zeigt uns, dass sich unsere konsequent kundenorientierte Arbeit und unser Streben nach höchster Qualität weiterhin bewähren.\n\nDiese unabhängige Anerkennung motiviert uns, den hohen Ansprüchen unserer Kundschaft auch zukünftig gerecht zu werden und unsere Prozesse mit derselben Leidenschaft und Sorgfalt weiterzuführen. Unser Ziel bleibt: Absolute Zuverlässigkeit und Vertrauen – von Mensch zu Mensch!\n\nWir danken unseren geschätzten Kunden und unserem engagierten Team für ihre Unterstützung auf diesem Weg.",
    _orbi: { component: "SectionAwards" },
  },
  {
    title: "Zofingen Treuhand AG",
    body: "Bei der Zofingen Treuhand AG setzen wir auf absolute Verlässlichkeit und persönliche Betreuung. Unser Single Point of Contact-Modell reduziert Ihren administrativen Aufwand, indem Sie eine zentrale Anlaufstelle für all Ihre Anliegen haben. Von der Buchhaltung bis zur Steueroptimierung – wir stehen an Ihrer Seite.\n\nUnsere Dienstleistungen werden präzise und individuell auf Ihre Bedürfnisse abgestimmt, sodass Sie sich stressfrei auf das Wachstum Ihres Unternehmens konzentrieren können. Mehr Zeit, weniger Sorgen – dafür stehen wir.",
    image: img("about-box.png"),
    _orbi: { component: "SectionCentered" },
  },
  {
    title: "Berechnen Sie Ihre monatlichen\nBuchhaltungskosten",
    body: "Möchten Sie Ihre Lohnabrechnung optimieren und von unserem professionellen Service profitieren? Buchen Sie jetzt Ihr persönliches Beratungsgespräch und machen Sie sich die Expertise von Zofingen Treuhand AG zu Nutze.",
    ctaLabel: "Zum Preisrechner",
    ctaHref: "#preisrechner",
    _orbi: { component: "SectionCalculator" },
  },
  {
    background: img("owner-bg.jpg"),
    photo: img("philippe-round.png"),
    name: "Inhaber Philippe Bally",
    quote: "Wir können den Wind nicht ändern, aber die Segel anders setzen.",
    badge: img("badge-steuerexperten.png"),
    intro: "Nach vielen Jahren Tätigkeit für Kanton und Gemeinden, habe ich es mir zur Aufgabe gemacht, meine Expertise direkt und persönlich in den Dienst von Menschen und Unternehmen zu stellen.\n\nMit dem Fokus auf die Zukunft biete ich Ihnen eine massgeschneiderte Treuhandberatung, die auf persönlicher Betreuung basiert – von Mensch zu Mensch.",
    credentials: [
      "15 Jahre leitender Steuerkomissär Kanton Aargau",
      "7 Jahre Leiter Steuern einer Komunalen Veranlagungsbehörde im Kt. Aargau",
      "7 Jahre Fachspezialist Steuern in verschiedenen Aargauer Gemeinden",
      "Abschluss Dipl. Treuhänder FA",
      "Abschluss Steuerexperte SSK",
      "Abschluss CAS Steuerfachleute Aargauer Gemeinden",
      "Fachdozent Fachhochschule Nordwestschweiz",
    ],
    _orbi: { component: "SectionOwner" },
  },
  {
    services: [
      {
        title: "Unternehmens\nSteuerberatung",
        body: "Optimale Steuerstrategien, die Ihre Steuerlast senken und Ihnen finanzielle Sicherheit bieten.",
        image: img("service-1.jpg"),
      },
      {
        title: "Buchhaltung\nJahresabschlüse",
        body: "Effiziente, digitale Lösungen für Ihre Buchhaltung und fehlerfreie Jahresabschlüsse.",
        image: img("service-2.jpg"),
      },
      {
        title: "Externe\nLohnbuchhaltung",
        body: "Gesetzeskonforme Lohnabrechnungen mit automatisierten Prozessen für KMUs jeder Grösse.",
        image: img("service-3.jpg"),
      },
      {
        title: "Firmengründung\nSchweiz",
        body: "Begleitung von der Planung bis zur Gründung – massgeschneidert für Ihren Erfolg.",
        image: img("service-4.jpg"),
      },
      {
        title: "Immobilienverwaltung\nSchweiz",
        body: "Fachkundige Verwaltung von Liegenschaften inklusive Buchhaltung und Steueroptimierung.",
        image: img("service-5.jpg"),
      },
      {
        title: "Grundstück-\ngewinnsteuern",
        body: "Professionelle Unterstützung bei Grundstückgewinnsteuern – maximieren Sie Ihren Verkaufsgewinn.",
        image: img("service-6.jpg"),
      },
    ],
    _orbi: { component: "SectionServices" },
  },
  {
    title: "Unser Prozess",
    subtitle: "Effiziente Treuhandlösungen für Ihr Unternehmen",
    steps: [
      {
        title: "Kennenlernen & Zieldefinition",
        body: "Wir erfassen Ihre individuellen Bedürfnisse in der Steuerberatung, Buchhaltung und Lohnadministration, um klare Ziele zu definieren.",
      },
      {
        title: "Priorisierung & Umsetzung",
        body: "Wir setzen optimierte Steuerstrategien, digitale Buchhaltung und Lohnabrechnung um, damit Ihre Finanzplanung langfristig effizient ist.",
      },
      {
        title: "Berichterstattung & Optimierung",
        body: "Wir liefern Ihnen kontinuierlich Steuerberichte und Anpassungen zur Sicherstellung rechtlicher und steuerlicher Effizienz mit Blick in die Zukunft.",
      },
    ],
    ctaLabel: "Jetzt kennenlernen",
    ctaHref: "#kontakt",
    _orbi: { component: "SectionProcess" },
  },
  {
    text: "Wir können den Wind nicht ändern, aber die Segel anders setzen.",
    _orbi: { component: "SectionQuoteBanner" },
  },
  {
    title: "Unser Team",
    subtitle: "Persönlich, engagiert und immer für Sie da",
    intro: "Bei der Zofingen Treuhand AG bieten wir Ihnen mehr als nur Standardlösungen. Unser engagiertes Team entwickelt gezielte Optimierungsvorschläge und sorgt dafür, dass Ihre Finanzen effizient organisiert und rechtlich abgesichert sind.",
    bullets: [
      {
        bold: "Wir planen zielgerichtet",
        text: "– Jedes Problem hat eine Lösung, und mit unserer Fachkompetenz finden wir den besten Weg, es zu lösen. Egal, wie komplex die Herausforderung ist, wir entwickeln eine massgeschneiderte Strategie.",
      },
      {
        bold: "Wir denken voraus",
        text: "– Wir arbeiten proaktiv und sorgen dafür, dass Sie auch in der Zukunft optimal aufgestellt sind. Verlassen Sie sich auf uns – wir lassen Sie nicht im Stich, egal in welcher Phase.",
      },
    ],
    members: [
      {
        name: "Philippe Bally",
        role: "Dipl. Treuhänder &\nSteuerexperte",
        description:
          "Mit über 20 Jahren Erfahrung in der Steuerberatung führt Philippe unser Team. Seine Expertise liegt in der Erstellung und Optimierung der Steuerstrategien für KMU's sowie in der Vertretung der Kunden vor Steuerbehörden.",
        image: img("team-philippe.png"),
      },
      {
        name: "Kateryna Abegglen",
        role: "Treuhänderin mit eidg. FA",
        description:
          "Kateryna ist die Ansprechpartnerin für alle Fragen rund um Buchhaltung, MWST und Steuern. Sie berät Kunden mit fundierter Fachkenntnis und langjähriger Erfahrung und koordiniert das Team im Tagesgeschäft.",
        image: img("team-kateryna.png"),
      },
      {
        name: "Daniela Nadler",
        role: "Treuhänderin mit eidg. FA",
        description:
          "Daniela ist die Ansprechpartnerin für Jahresabschlüsse, Steuererklärungen und die laufende Mandatsbetreuung. Sie begleitet KMU mit fachlicher Genauigkeit und sorgt für klare Abläufe.",
        image: img("team-daniela.png"),
      },
      {
        name: "Emre Duman",
        role: "Fachspezialist\nBuchhaltung",
        description:
          "Emre führt Ausbildungskurse unserer Cloud-Software durch und er ist unser Garant für die vollständige und richtige Verbuchung von umfangreichen Kundenbuchhaltungen. Er stellt sicher, dass die Buchhaltungsprozesse reibungslos, effizient und nach höchsten Qualitätsstandards ablaufen.",
        image: img("team-emre.png"),
      },
      {
        name: "Aengi Kuoni",
        role: "Fachfrau\nSteuern",
        description:
          "Aengi ist die erste Ansprechperson für unsere Steuererklärungskunden. Sie stellt sicher, dass die Steuererklärungen vollständig vorbereitet und sämtliche Fristen eingehalten werden. Ebenfalls unterstützt sie unseren Fachspezialist Buchhaltung bei der korrekten Erfassung der Buchhaltungen.",
        image: img("team-aengi.png"),
      },
      {
        name: "Andrea Bally",
        role: "Fachfrau\nSozialversicherungen",
        description:
          "Andrea ist Ihre Ansprechpartnerin in allen Fragen rund um Löhne, Sozialversicherungen und Vorsorge und sorgt dafür, dass eine rechtlich korrekte und transparente Abrechnung gewährleistet ist. Dabei unterstützt sie Sie kompetent und zuverlässig bei administrativen Anliegen.",
        image: img("team-andrea.png"),
      },
    ],
    _orbi: { component: "SectionTeam" },
  },
  {
    image: img("problems-side.png"),
    titleTop: "Unsere Zuverlässigkeit -\nfür Ihre Zufriedenheit.",
    titleItalic: "Gemeinsam «steuern» wir\nSie in eine sichere Zukunft.",
    items: [
      "Unzureichendes Wissen oder fehlendes Verständnis für gesetzliche Vorschriften können zu Rechtsproblemen und Strafen führen.",
      "Unnötige Zahlungen von überhöhten Steuern und Abgaben (z.B. MwSt, AHV etc.).",
      "Unvollständige oder ungenaue Jahresabschlüsse, die zu steuerrechtlichen Problemen führen können.",
      "Fehlerhafte Lohnabrechnungen mit falschen Beitragssätzen oder zeitliche Verzögerungen der Abrechnungen können zu Problemen mit Mitarbeitenden führen.",
      "Unvollständige oder falsche Deklarationen bei Steuererklärungen und Abgaben können zu unnötigen Zahlungen führen.",
    ],
    ctaLabel: "Jetzt kennenlernen",
    ctaHref: "#kontakt",
    _orbi: { component: "SectionReliability" },
  },
  {
    title: "Erfahrungen unserer Kunden",
    quote:
      "Sehr zu empfehlen, sehr hilfreich! Flexibel, persönlich, kundenfreundlich und noch mehr. Wir geben für solche Dienstleistungen gerne Geld aus. Als kleineres KMU schätzen wir die Zofingen Treuhand AG als kompetenten und zeitgemässen Partner. Auch das auf individuelle Bedürfnisse eingegangen wird. So erhalten wir für unsere Anliegen die optimale Unterstützung. Es hat sich gelohnt! Danke an Philippe und sein Team.",
    author: "Kevin Zacher",
    role: "Kunde",
    image: img("testimonial-side.jpg"),
    _orbi: { component: "SectionTestimonials" },
  },
  {
    title: "Wissenswertes",
    articles: [
      {
        title: "AHV-Reform führt zur Erhöhung der MwSt-Sätze auf den 1. Januar 2024",
        image: img("article-1.jpg"),
      },
      { title: "Lohn oder Dividende für Unternehmer?", image: img("article-2.jpg") },
      {
        title: "Auszahlung Pensionskassenkapital oder Rentenbezug?",
        image: img("article-3.jpg"),
      },
      {
        title: "Steuerlicher Liegenschaftsunterhalt: Kosten für energetische Sanierungen",
        image: img("article-4.jpg"),
      },
      {
        title: "Soll ich eine Immobilien AG oder Immobilien GmbH gründen?",
        image: img("article-4.jpg"),
      },
      { title: "Berechnung der Grundstückgewinnsteuern", image: img("article-6.jpg") },
    ],
    _orbi: { component: "SectionArticles" },
  },
  {
    title: "Unser Netzwerk & Partner",
    logos: [
      img("partner-1.png"),
      img("partner-2.png"),
      img("partner-3.png"),
      img("partner-4a.png"),
      img("partner-5.png"),
      img("partner-6.png"),
    ],
    _orbi: { component: "SectionPartners" },
  },
  {
    title: "Bexio Platin-Partner",
    body: "Als bexio Platin-Partner unterstützt die Zofingen Treuhand AG Unternehmen bei der effizienten Digitalisierung ihrer Buchhaltung. Persönlich betreut, zuverlässig umgesetzt und optimal auf Ihre Finanzprozesse abgestimmt.",
    image: img("bexio-platinum.png"),
    _orbi: { component: "SectionBexio" },
  },
  {
    title: "Beratungsgespräch buchen",
    body: "Erfahren Sie, wie unsere Treuhandlösungen für KMUs in der Schweiz Ihnen Zeit und Nerven sparen. Buchen Sie jetzt Ihre kostenlose Erstberatung und erleben Sie, wie wir Ihre Finanzprozesse optimieren und Sie rechtlich absichern.",
    ctaLabel: "Jetzt kennenlernen",
    ctaHref: "#kontakt",
    _orbi: { component: "SectionCta" },
  },
]

const title = {
  de: "Treuhand & Steuerberatung in Zofingen",
  en: "Trust & Tax Consulting in Zofingen",
}
const keywords = [
  "Treuhand",
  "Steuerberatung",
  "Zofingen",
  "Buchhaltung",
  "Lohnbuchhaltung",
  "KMU",
]

async function run() {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "X-API-KEY": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sql: "UPDATE pages SET title = :title::json, sections = :sections::json, keywords = :keywords::json, updated_at = CURRENT_TIMESTAMP WHERE slug = :slug RETURNING id, slug",
      bindings: {
        title: JSON.stringify(title),
        sections: JSON.stringify(sections),
        keywords: JSON.stringify(keywords),
        slug: "home",
      },
    }),
  })
  const text = await res.text()
  console.log("status:", res.status)
  console.log("result:", text)
}

run()
