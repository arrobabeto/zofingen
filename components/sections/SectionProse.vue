<script setup lang="ts">
  import SafeHtml from "~/components/common/SafeHtml.vue"
  import type { I18nString } from "~/types/util/I18nString"
  import { useTranslate } from "~/composables/useTranslate"

  const p = defineProps<{
    title: I18nString
    content: I18nString
  }>()

  const t = useTranslate()
</script>

<template>
  <section
    class="max-w-3xl mx-auto my-6 w-full rounded-2xl border border-[#e0e0e0] bg-[#fefefe]/95 p-5 shadow-sm dark:border-[#282a36] dark:bg-[#191a22]/95"
  >
    <h2 class="mb-3 text-xl font-semibold text-[#010101] dark:text-[#fefefe]">
      {{ t(title) }}
    </h2>
    <div class="prose prose-sm dark:prose-invert max-w-none">
      <SafeHtml :html="t(content)" />
    </div>
  </section>
</template>
