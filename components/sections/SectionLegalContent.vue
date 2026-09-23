<script setup lang="ts">
  import SafeHtml from "~/components/common/SafeHtml.vue"
  import type { I18nString } from "~/types/util/I18nString"
  import { useTranslate } from "~/composables/useTranslate"

  const p = defineProps<{
    content: I18nString
    subtitle?: string
  }>()

  const t = useTranslate()
</script>

<template>
  <section class="w-full px-6 pb-16 pt-10 lg:px-[100px] lg:pb-24 lg:pt-14">
    <div class="mx-auto max-w-[860px]">
      <p
        v-if="p.subtitle"
        class="mb-10 font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ p.subtitle }}
      </p>
      <div
        class="legal-body font-serif text-[16px] leading-[24px] text-brand-blue [&_a]:text-brand-blue [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:font-bold [&_h2]:text-[24px] [&_h2]:leading-[32px] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-bold [&_h3]:text-[20px] [&_h3]:leading-[28px] [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_strong]:font-bold"
      >
        <SafeHtml :html="t(p.content)" />
      </div>
    </div>
  </section>
</template>
