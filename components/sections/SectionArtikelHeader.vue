<script setup lang="ts">
  import type { I18nString } from "~/types/util/I18nString"
  import { useTranslate } from "~/composables/useTranslate"
  import { dt } from "~/functions/dt"

  const p = defineProps<{
    title: I18nString
    date: string
  }>()

  const t = useTranslate()
</script>

<template>
  <section class="w-full px-6 pb-5 pt-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1099px] flex-col gap-10">
      <h1
        class="article-post-title max-w-[687px] font-serif text-[28px] font-bold leading-[36px] text-brand-blue lg:text-[32px] lg:leading-[42px]"
      >
        {{ t(p.title) }}
      </h1>
      <div
        class="flex items-center gap-3 font-serif text-[20px] leading-[25px] text-brand-blue"
      >
        <time :datetime="p.date">{{ dt.toArticle(p.date) }}</time>
        <span class="h-2 w-2 rounded-full bg-brand-blue" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
