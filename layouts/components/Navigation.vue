<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue"

  const scrolled = ref(false)
  const openMenu = ref<string | null>(null)

  function onScroll() {
    scrolled.value = window.scrollY > 8
  }

  onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
  })
  onUnmounted(() => window.removeEventListener("scroll", onScroll))

  const utilityLinks = [
    { name: "Links", to: "/links" },
    { name: "Merkblätter", to: "/ressourcen" },
    { name: "News", to: "/artikel" },
  ]

  const dienstleistungen = [
    { name: "Firmengründung", to: "/firmengruendung" },
    { name: "KMU", to: "/kmu" },
    { name: "Jahresabschluss", to: "/jahresabschluss" },
    { name: "Externe Lohnbuchhaltung", to: "/externe-lohnbuchhaltung" },
    { name: "Steuern für Privatpersonen", to: "/steuern-fuer-privatpersonen" },
    {
      name: "Unabhängige Vorsorgeplanung & Pensionsplanung",
      to: "/unabhaengige-vorsorge-und-pensionsplanung",
    },
    { name: "Immobilien", to: "/immobilien" },
    { name: "Grundstückgewinnsteuern", to: "/grundstueckgewinnsteuern" },
  ]

  const wissenswertes = [
    { name: "Artikel", to: "/artikel" },
    { name: "FAQ", to: "/faq" },
  ]

  function toggleMenu(name: string) {
    openMenu.value = openMenu.value === name ? null : name
  }

  function closeMenu() {
    openMenu.value = null
  }
</script>

<template>
  <!-- Utility bar: white, stays at the top of the page (scrolls away) -->
  <div class="relative z-20 w-full bg-white">
    <div
      class="mx-auto flex max-w-[1225px] items-center justify-center gap-6 px-6 py-5 font-display text-[18px]"
    >
      <a href="#" class="flex items-center gap-2 text-black transition hover:opacity-70">
        <img
          src="/logo_black_font_without_bordero.webp"
          alt="BAYO"
          class="h-6 w-auto object-contain"
        />
        Kundenportal
      </a>
      <span class="h-5 w-px bg-brand-blue/30" />
      <NuxtLinkLocale
        v-for="l of utilityLinks"
        :key="l.name"
        :to="l.to"
        class="text-brand-blue transition hover:opacity-70"
        @click="closeMenu"
      >
        {{ l.name }}
      </NuxtLinkLocale>
    </div>
  </div>

  <!-- Main nav: transparent over hero, white background on scroll -->
  <header
    class="sticky top-0 z-30 -mb-[76px] transition-colors duration-300"
    :class="scrolled ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'"
  >
    <div
      class="mx-auto flex h-[76px] max-w-[1225px] items-center justify-between gap-6 px-6"
    >
        <NuxtLinkLocale to="/" @click="closeMenu">
          <img
            src="/img/home/logo-treuhand.png"
            alt="Zofingen Treuhand AG"
            class="h-[52px] w-auto object-contain"
          />
        </NuxtLinkLocale>

        <nav
          class="hidden flex-wrap items-center justify-end gap-9 font-serif text-[18px] font-bold md:flex"
        >
          <!-- Dienstleistungen -->
          <div
            class="relative"
            @mouseenter="openMenu = 'dienstleistungen'"
            @mouseleave="closeMenu"
          >
            <button
              type="button"
              class="inline-flex items-center gap-2 transition hover:opacity-70"
              :class="
                openMenu === 'dienstleistungen' ? 'text-brand-light' : 'text-brand-blue'
              "
              @click="toggleMenu('dienstleistungen')"
            >
              Dienstleistungen
              <span class="text-[12px]">▾</span>
            </button>
            <div
              v-show="openMenu === 'dienstleistungen'"
              class="absolute left-0 top-full z-40 min-w-[320px] bg-brand-blue py-2 shadow-lg"
            >
              <NuxtLinkLocale
                v-for="item of dienstleistungen"
                :key="item.to"
                :to="item.to"
                class="block px-5 py-2 font-serif text-[14px] font-normal leading-[25px] text-white transition hover:bg-brand-blue2"
                @click="closeMenu"
              >
                {{ item.name }}
              </NuxtLinkLocale>
            </div>
          </div>

          <!-- Wissenswertes -->
          <div
            class="relative"
            @mouseenter="openMenu = 'wissenswertes'"
            @mouseleave="closeMenu"
          >
            <button
              type="button"
              class="inline-flex items-center gap-2 transition hover:opacity-70"
              :class="
                openMenu === 'wissenswertes' ? 'text-brand-light' : 'text-brand-blue'
              "
              @click="toggleMenu('wissenswertes')"
            >
              Wissenswertes
              <span class="text-[12px]">▾</span>
            </button>
            <div
              v-show="openMenu === 'wissenswertes'"
              class="absolute left-0 top-full z-40 min-w-[200px] bg-brand-blue py-2 shadow-lg"
            >
              <NuxtLinkLocale
                v-for="item of wissenswertes"
                :key="item.to"
                :to="item.to"
                class="block px-5 py-2 font-serif text-[14px] font-normal leading-[25px] text-white transition hover:bg-brand-blue2"
                @click="closeMenu"
              >
                {{ item.name }}
              </NuxtLinkLocale>
            </div>
          </div>

          <NuxtLinkLocale
            to="/ueber-uns"
            class="text-brand-blue transition hover:opacity-70"
            @click="closeMenu"
          >
            Über uns
          </NuxtLinkLocale>
          <NuxtLinkLocale
            to="/kontakt"
            class="text-brand-blue transition hover:opacity-70"
            @click="closeMenu"
          >
            Kontakt
          </NuxtLinkLocale>
        </nav>
      </div>
    </header>
</template>
