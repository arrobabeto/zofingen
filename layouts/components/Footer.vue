<script setup lang="ts">
  import { ref } from "vue"
  import FormModal from "~/components/forms/_FormModal.vue"
  import PdfHandbookForm from "~/components/forms/_PdfHandbookForm.vue"

  const isPdfModalOpen = ref(false)
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function openPdfModal() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
    isPdfModalOpen.value = true
  }

  function closePdfModal() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
    isPdfModalOpen.value = false
  }

  function onPdfFormSuccess() {
    closeTimer = setTimeout(closePdfModal, 3000)
  }

  const kontakt = [
    { icon: "phone", label: "062 745 70 30", href: "tel:+41627457030" },
    { icon: "email", label: "kontakt@zofingen-treuhand.ch", href: "mailto:kontakt@zofingen-treuhand.ch" },
    {
      icon: "location",
      label: "Kirchplatz 4 4800 Zofingen",
      href: "https://maps.google.com/?q=Kirchplatz+4+4800+Zofingen",
    },
    { icon: "linkedin", label: "Vernetzen mit Linkedin", href: "https://www.linkedin.com" },
  ] as const

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
      <div
        class="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 rounded-[10px] bg-brand-light/60 px-6 py-12 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.1)] lg:flex-row lg:items-center lg:px-16 lg:py-16"
      >
        <p class="max-w-[421px] font-serif text-[24px] font-bold leading-normal text-brand-blue">
          Kostenloses Firmengründungshandbuch mit Schritt-für-Schritt-Anleitung
        </p>
        <button
          type="button"
          class="flex h-16 w-full min-w-[240px] max-w-[376px] shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] bg-brand-blue px-10 font-serif text-[18px] font-bold text-white transition hover:bg-brand-blue2 lg:w-[376px]"
          @click="openPdfModal"
        >
          PDF anfordern
        </button>
      </div>
    </div>

    <div class="px-6 pt-16 lg:px-[100px] lg:pt-[64px]">
      <div class="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Kontakt</h3>
          <ul class="flex flex-col gap-[11px] font-serif text-[18px] leading-[25px] text-brand-blue">
            <li v-for="x of kontakt" :key="x.label">
              <a :href="x.href" class="flex items-center gap-3 hover:underline">
                <svg
                  v-if="x.icon === 'phone'"
                  class="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"
                  />
                </svg>
                <svg
                  v-else-if="x.icon === 'email'"
                  class="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4v10h16V8l-8 5z"
                  />
                </svg>
                <svg
                  v-else-if="x.icon === 'location'"
                  class="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path
                    d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z"
                    stroke-linejoin="round"
                  />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <svg
                  v-else-if="x.icon === 'linkedin'"
                  class="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H9z"
                  />
                </svg>
                <span>{{ x.label }}</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Dienstleistungen</h3>
          <ul class="font-serif text-[18px] text-brand-blue">
            <li v-for="x of dienstleistungen" :key="x.to" class="leading-9">
              <NuxtLinkLocale :to="x.to" class="hover:underline">{{ x.label }}</NuxtLinkLocale>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Rechtliches</h3>
          <ul class="flex flex-col gap-[11px] font-serif text-[18px] leading-[25px] text-brand-blue">
            <li v-for="x of rechtliches" :key="x.label">
              <a :href="x.href" class="hover:underline">{{ x.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-serif text-[24px] font-bold text-brand-blue">Weiteres</h3>
          <ul class="flex flex-col gap-[11px] font-serif text-[18px] leading-[25px] text-brand-blue">
            <li v-for="x of weiteres" :key="x.to">
              <NuxtLinkLocale :to="x.to" class="hover:underline">{{ x.label }}</NuxtLinkLocale>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-16 bg-brand-blue px-6 py-6 lg:mt-[64px]">
      <p class="text-center font-serif text-[14px] leading-[25px] text-white">
        © 2026 Made with ❤️ in 🇨🇭 by Bexolutions Marketing und Vertrieb AG, Wo Meine
        Marke zur Nummer 1 wird – Digital Marketing, Business Development, Websites, Social
        Media &amp; Videos.
      </p>
    </div>
  </footer>

  <FormModal :open="isPdfModalOpen" @close="closePdfModal">
    <PdfHandbookForm @success="onPdfFormSuccess" />
  </FormModal>
</template>
