<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue"

  const scrolled = ref(false)
  const openMenu = ref<string | null>(null)
  const mobileOpen = ref(false)
  const mobileSection = ref<string | null>(null)

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

  function toggleMobileSection(name: string) {
    mobileSection.value = mobileSection.value === name ? null : name
  }

  function toggleMobileNav() {
    mobileOpen.value = !mobileOpen.value
    if (!mobileOpen.value) {
      mobileSection.value = null
      closeMenu()
    }
  }

  function closeAllMenus() {
    mobileOpen.value = false
    mobileSection.value = null
    closeMenu()
  }
</script>

<template>
  <!-- Utility bar: white, stays at the top of the page (scrolls away) -->
  <div class="relative z-20 w-full bg-white">
    <div
      class="site-utility-bar mx-auto flex max-w-[1225px] items-center justify-center gap-6 px-6 py-5 font-display text-[18px]"
    >
      <a
        href="https://portalv2.bayo.ch/zofingentreuhand/auth/signin"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 text-black transition hover:opacity-70"
      >
        <img
          src="/logo_black_font_without_bordero.webp"
          alt="BAYO"
          class="h-4 w-auto object-contain"
        />
        Kundenportal
      </a>
      <span class="site-utility-divider h-5 w-px bg-brand-blue/30" />
      <NuxtLinkLocale
        v-for="l of utilityLinks"
        :key="l.name"
        :to="l.to"
        class="text-brand-blue transition hover:opacity-70"
        @click="closeAllMenus"
      >
        {{ l.name }}
      </NuxtLinkLocale>
    </div>
  </div>

  <!-- Main nav: transparent over hero, white background on scroll -->
  <header
    class="sticky top-0 z-30 -mb-[76px] transition-colors duration-300"
    :class="scrolled || mobileOpen ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'"
  >
    <div
      class="mx-auto flex h-[76px] max-w-[1225px] items-center justify-between gap-6 px-6"
    >
      <NuxtLinkLocale to="/" @click="closeAllMenus">
        <img
          src="/img/home/logo-treuhand.png"
          alt="Zofingen Treuhand AG"
          class="h-[52px] w-auto object-contain"
        />
      </NuxtLinkLocale>

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-brand-blue text-brand-blue lg:hidden"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-nav-panel"
        aria-label="Menü öffnen"
        @click="toggleMobileNav"
      >
        <span class="sr-only">Menü</span>
        <svg
          v-if="!mobileOpen"
          viewBox="0 0 24 24"
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
        </svg>
      </button>

      <nav
        class="hidden items-center justify-end gap-5 font-serif text-[16px] font-bold lg:flex lg:gap-[25px] lg:text-[19px]"
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
              @click="closeAllMenus"
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
              @click="closeAllMenus"
            >
              {{ item.name }}
            </NuxtLinkLocale>
          </div>
        </div>

        <NuxtLinkLocale
          to="/ueber-uns"
          class="text-brand-blue transition hover:opacity-70"
          @click="closeAllMenus"
        >
          Über uns
        </NuxtLinkLocale>
        <NuxtLinkLocale
          to="/kontakt"
          class="text-brand-blue transition hover:opacity-70"
          @click="closeAllMenus"
        >
          Kontakt
        </NuxtLinkLocale>
      </nav>
    </div>

    <nav
      v-show="mobileOpen"
      id="mobile-nav-panel"
      class="border-t border-brand-blue/15 bg-white px-6 py-4 lg:hidden"
    >
      <div class="flex flex-col gap-2 font-serif text-[16px] font-bold text-brand-blue">
        <button
          type="button"
          class="flex w-full items-center justify-between py-2 text-left"
          :aria-expanded="mobileSection === 'dienstleistungen'"
          @click="toggleMobileSection('dienstleistungen')"
        >
          Dienstleistungen
          <span class="text-[12px]">{{ mobileSection === "dienstleistungen" ? "▴" : "▾" }}</span>
        </button>
        <div
          v-show="mobileSection === 'dienstleistungen'"
          class="flex flex-col gap-1 pb-2 pl-3 font-normal"
        >
          <NuxtLinkLocale
            v-for="item of dienstleistungen"
            :key="item.to"
            :to="item.to"
            class="py-1.5 text-[15px] leading-snug"
            @click="closeAllMenus"
          >
            {{ item.name }}
          </NuxtLinkLocale>
        </div>

        <button
          type="button"
          class="flex w-full items-center justify-between py-2 text-left"
          :aria-expanded="mobileSection === 'wissenswertes'"
          @click="toggleMobileSection('wissenswertes')"
        >
          Wissenswertes
          <span class="text-[12px]">{{ mobileSection === "wissenswertes" ? "▴" : "▾" }}</span>
        </button>
        <div
          v-show="mobileSection === 'wissenswertes'"
          class="flex flex-col gap-1 pb-2 pl-3 font-normal"
        >
          <NuxtLinkLocale
            v-for="item of wissenswertes"
            :key="item.to"
            :to="item.to"
            class="py-1.5 text-[15px]"
            @click="closeAllMenus"
          >
            {{ item.name }}
          </NuxtLinkLocale>
        </div>

        <NuxtLinkLocale
          to="/ueber-uns"
          class="py-2"
          @click="closeAllMenus"
        >
          Über uns
        </NuxtLinkLocale>
        <NuxtLinkLocale
          to="/kontakt"
          class="py-2"
          @click="closeAllMenus"
        >
          Kontakt
        </NuxtLinkLocale>
      </div>
    </nav>
  </header>
</template>
