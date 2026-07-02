<script lang="ts" setup="">
  import { onMounted, ref } from "vue"
  import ButtonV from "~/components/common/ButtonV.vue"

  const STORAGE_KEY = "cookie-consent-choice"
  const isVisible = ref(true)

  function persistChoice(choice: "accepted" | "denied") {
    if (typeof document !== "undefined")
      document.cookie = `${STORAGE_KEY}=${choice}; path=/; max-age=31536000; samesite=lax`

    if (typeof window === "undefined") return

    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Ignore storage failures (private mode, blocked storage, etc.).
    }
  }

  function applyConsent(consent: "granted" | "denied") {
    try {
      const gtagFn = typeof window !== "undefined" ? window.gtag : undefined
      if (typeof gtagFn !== "function") return

      gtagFn("consent", "update", {
        ad_storage: consent,
        ad_user_data: consent,
        ad_personalization: consent,
        analytics_storage: consent,
      })
    } catch {
      // Consent persistence should still work even if gtag fails.
    }
  }

  function onAccept() {
    persistChoice("accepted")
    isVisible.value = false
    applyConsent("granted")
  }

  function onDeny() {
    persistChoice("denied")
    isVisible.value = false
    applyConsent("denied")
  }

  function readChoiceFromCookie() {
    if (typeof document === "undefined") return null
    const pref = document.cookie
      .split("; ")
      .find((x) => x.startsWith(`${STORAGE_KEY}=`))
      ?.split("=")[1]
    return pref === "accepted" || pref === "denied" ? pref : null
  }

  onMounted(() => {
    if (typeof window === "undefined") return
    let savedChoice: string | null = null
    try {
      savedChoice = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      savedChoice = null
    }

    if (!savedChoice) savedChoice = readChoiceFromCookie()
    if (!savedChoice) return

    isVisible.value = false
    if (savedChoice === "accepted") applyConsent("granted")
    if (savedChoice === "denied") applyConsent("denied")
  })
</script>

<template>
  <div v-if="isVisible" class="fixed inset-x-0 bottom-4 z-[100] px-4">
    <article
      class="max-w-2xl pointer-events-auto isolate mx-auto rounded-2xl border border-[#e0e0e0] bg-[#fefefe]/95 p-4 shadow-2xl shadow-[#010101]/10 backdrop-blur dark:border-[#282a36] dark:bg-[#191a22]/95 dark:shadow-[#010101]/30"
    >
      <h2 class="text-sm font-semibold text-[#010101] dark:text-[#fefefe]">
        Cookie consent
      </h2>
      <p class="mt-1 text-sm text-[#4e4e4e] dark:text-[#cbcbcb]">
        We use cookies for analytics and personalized content. You can update
        this choice anytime.
      </p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <ButtonV @click="onDeny">Only essential</ButtonV>
        <ButtonV @click="onAccept">Accept all</ButtonV>
      </div>
    </article>
  </div>
</template>
