<script setup lang="ts">
  import { computed, onMounted } from "vue"
  import { useI18n, useRuntimeConfig } from "#imports"

  const SCRIPT_URL = "https://news.google.com/swg/js/v1/publisher.js"
  const SCRIPT_ATTR = "data-zofingen-preferred-source"

  type PreferredSourceClient = {
    init(options: { theme: "light" | "dark"; lang: string }): void
    addPreferredSource(): void
  }

  const props = withDefaults(
    defineProps<{
      theme?: "light" | "dark"
    }>(),
    {
      theme: "light",
    },
  )

  const config = useRuntimeConfig()
  const { locale } = useI18n()

  const enabled = computed(() => config.public.preferredSourceEnabled !== false)

  const labels: Record<string, string> = {
    de: "Zu bevorzugten Quellen hinzufügen",
    en: "Add to preferred sources",
  }

  const label = computed(() => labels[locale.value] ?? labels.en)

  let addPreferredSource: (() => void) | null = null

  function siteHostname(): string {
    try {
      return new URL(config.public.siteUrl).hostname
    } catch {
      return "www.zofingen-treuhand.ch"
    }
  }

  function openDeeplink() {
    const q = encodeURIComponent(siteHostname())
    window.open(
      `https://www.google.com/preferences/source?q=${q}`,
      "_blank",
      "noopener,noreferrer",
    )
  }

  function handleClick() {
    if (addPreferredSource) {
      try {
        addPreferredSource()
        return
      } catch {
        // fall through to deeplink
      }
    }
    openDeeplink()
  }

  function registerCallback() {
    window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []
    window.PREFERRED_SOURCE.push((preferredSource: PreferredSourceClient) => {
      preferredSource.init({
        theme: props.theme,
        lang: locale.value === "de" ? "de" : "en",
      })
      addPreferredSource = () => preferredSource.addPreferredSource()
    })
  }

  function loadScript(): Promise<void> {
    return new Promise((resolve) => {
      if (document.querySelector(`script[${SCRIPT_ATTR}]`)) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = SCRIPT_URL
      script.async = true
      script.setAttribute("preferred-sources-control", "manual")
      script.setAttribute(SCRIPT_ATTR, "true")
      script.onload = () => resolve()
      script.onerror = () => resolve()
      document.head.appendChild(script)
    })
  }

  onMounted(async () => {
    if (!enabled.value) return
    registerCallback()
    await loadScript()
  })
</script>

<template>
  <div v-if="enabled" class="preferred-source">
    <button type="button" class="preferred-source__btn" @click="handleClick">
      <svg
        class="preferred-source__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span class="preferred-source__label">{{ label }}</span>
    </button>
  </div>
</template>

<style scoped>
  .preferred-source {
    width: fit-content;
    max-width: 100%;
    overflow: visible;
  }

  .preferred-source__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    width: auto;
    max-width: 100%;
    min-height: 2.75rem;
    padding: 0.625rem 1rem;
    border: 1px solid #dadce0;
    border-radius: 9999px;
    background: #fff;
    color: #3c4043;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.35;
    text-align: center;
    cursor: pointer;
    overflow: visible;
    overflow-wrap: anywhere;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .preferred-source__btn:hover {
    background: #f8f9fa;
    border-color: #bdc1c6;
    box-shadow: 0 1px 2px rgb(60 64 67 / 15%);
  }

  .preferred-source__btn:focus-visible {
    outline: 2px solid #1a73e8;
    outline-offset: 2px;
  }

  .preferred-source__icon {
    flex: 0 0 auto;
    width: 1.125rem;
    height: 1.125rem;
  }

  .preferred-source__label {
    overflow-wrap: anywhere;
  }
</style>
