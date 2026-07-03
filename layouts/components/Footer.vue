<script setup lang="ts">
  const kontakt = [
    { label: "062 745 70 30", href: "tel:+41627457030" },
    { label: "kontakt@zofingen-treuhand.ch", href: "mailto:kontakt@zofingen-treuhand.ch" },
    { label: "Kirchplatz 4 4800 Zofingen", href: "https://maps.google.com/?q=Kirchplatz+4+4800+Zofingen" },
    { label: "Vernetzen mit Linkedin", href: "https://www.linkedin.com" },
  ]

  const dienstleistungen = [
    { label: "Jahresabschluss", to: "/jahresabschluss" },
    { label: "KMU", to: "/kmu" },
    { label: "Firmengründung", to: "/firmengruendung" },
    { label: "Externe Lohnbuchhaltung", to: "/externe-lohnbuchhaltung" },
    { label: "Steuern für Privatpersonen", to: "/steuern-fuer-privatpersonen" },
    { label: "Immobilien", to: "/immobilien" },
    { label: "Grundstückgewinnsteuern", to: "/grundstueckgewinnsteuern" },
  ]

  const rechtliches = [
    { label: "Datenschutzinformationen", href: "#" },
    { label: "Impressum", href: "#" },
    { label: "AGB's", href: "#" },
  ]

  const weiteres = [
    { label: "Über uns", to: "/ueber-uns" },
    { label: "FAQ", to: "/faq" },
    { label: "Wissenswertes", to: "/artikel" },
  ]
</script>

<template>
  <footer class="w-full bg-white">
    <div class="px-6 pt-16 lg:px-[100px]">
    <div class="mx-auto max-w-[1200px] rounded-[10px] bg-brand-light/60 px-6 py-12 lg:px-16">
      <div
        class="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center"
      >
        <p class="max-w-[421px] font-serif text-[24px] font-bold text-brand-blue">
          Kostenloses Firmengründungshandbuch mit Schritt-für-Schritt-Anleitung
        </p>
        <a
          href="#"
          class="flex h-12 items-center justify-center rounded-[10px] bg-brand-blue px-8 font-serif text-[18px] font-bold text-white transition hover:bg-brand-blue2"
        >
          PDF anfordern
        </a>
      </div>

      <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Kontakt</h3>
          <ul class="space-y-2.5 font-serif text-[18px] text-brand-blue">
            <li v-for="x of kontakt" :key="x.label">
              <a :href="x.href" class="hover:underline">{{ x.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Dienstleistungen</h3>
          <ul class="space-y-2 font-serif text-[18px] leading-9 text-brand-blue">
            <li v-for="x of dienstleistungen" :key="x.to">
              <NuxtLinkLocale :to="x.to" class="hover:underline">{{ x.label }}</NuxtLinkLocale>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Rechtliches</h3>
          <ul class="space-y-2.5 font-serif text-[18px] text-brand-blue">
            <li v-for="x of rechtliches" :key="x.label">
              <a :href="x.href" class="hover:underline">{{ x.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Weiteres</h3>
          <ul class="space-y-2.5 font-serif text-[18px] text-brand-blue">
            <li v-for="x of weiteres" :key="x.to">
              <NuxtLinkLocale :to="x.to" class="hover:underline">{{ x.label }}</NuxtLinkLocale>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>

    <div class="mt-10 bg-brand-blue px-6 py-4">
      <p class="text-center font-serif text-[14px] leading-[25px] text-white">
        © 2026 Made with ❤️ in 🇨🇭 by Bexolutions Marketing und Vertrieb AG, Wo Meine
        Marke zur Nummer 1 wird – Digital Marketing, Business Development, Websites, Social
        Media &amp; Videos.
      </p>
    </div>
  </footer>
</template>
