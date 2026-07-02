import type { I18nString } from "~/types/util/I18nString"
import { useI18n } from "#i18n"

export function useTranslate() {
  const { locale } = useI18n()

  return function (text?: I18nString | Phrase) {
    if (!text) return "..."
    if (typeof text === "string") text = phrases[text]
    return text[locale.value] ?? text["en"]
  }
}

// phrases
////////////////////////////////////////////////////////////////////////////////
type Phrase = keyof typeof phrases

export const phrases = {
  // generic
  address: {
    en: "Address",
    de: "Adresse",
  },
  all_rights_reserved: {
    en: "All rights reserved",
    de: "Alle Rechte vorbehalten",
  },
  company: {
    en: "Company",
    de: "Firma",
  },
  download: {
    en: "Download",
    de: "Herunterladen",
  },
  email: {
    en: "Email",
    de: "E-Mail",
  },
  first_name: {
    en: "First name",
    de: "Vorname",
  },
  homepage: {
    en: "Homepage",
    de: "Startseite",
  },
  last_name: {
    en: "Last name",
    de: "Nachname",
  },
  learn_more: {
    en: "Learn more",
    de: "Mehr erfahren",
  },
  load_more: {
    en: "Load more",
    de: "Mehr laden",
  },
  menu: {
    en: "Menu",
    de: "Menü",
  },
  message: {
    en: "Message",
    de: "Mitteilung",
  },
  page_not_found: {
    en: "Page not found",
    de: "Seite nicht gefunden",
  },
  save: {
    en: "Save",
    de: "Speichern",
  },
  search: {
    en: "Search",
    de: "Suche",
  },
  send: {
    en: "Send",
    de: "Senden",
  },
  sent_successfully: {
    en: "Sent successfully",
    de: "Erfolgreich gesendet",
  },
  share_content: {
    en: "Share content",
    de: "Inhalt teilen",
  },
  subscribe: {
    en: "Subscribe",
    de: "Abonnieren",
  },
  subscribed_successfully: {
    en: "Subscribed successfully",
    de: "Erfolgreich abonniert",
  },

  // sprecific
  project_specific_phrase: {
    en: "Project specific phrase",
    de: "Projektspezifische Phrase",
  },
}
