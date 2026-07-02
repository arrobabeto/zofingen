<script setup lang="ts">
  import { useTranslate } from "~/composables/useTranslate"

  const t = useTranslate()

  const footer = {
    text: { en: "© Webentertainer GmbH" },
  }
</script>

<template>
  <footer class="border-t border-[#e0e0e0] px-4 py-6 dark:border-[#282a36]">
    <div class="max-w-5xl mx-auto flex items-center justify-between gap-3">
      <p class="text-sm text-[#4e4e4e] dark:text-[#cbcbcb]">
        {{ t(footer.text) }}
      </p>
      <p class="text-xs text-[#4e4e4e] dark:text-[#cbcbcb]">
        Orbitype Headless CMS Template
      </p>
    </div>
  </footer>
</template>
