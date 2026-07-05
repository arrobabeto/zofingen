<script setup lang="ts">
  import SafeHtml from "~/components/common/SafeHtml.vue"

  defineProps<{
    html: string
  }>()
</script>

<template>
  <section class="w-full px-6 lg:px-[100px]">
    <div
      class="article-body mx-auto max-w-[1099px] font-serif text-[18px] leading-[25px] text-brand-blue [&_a]:text-brand-blue [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:scroll-mt-28 [&_h2]:font-bold [&_h2]:text-[18px] [&_h2]:leading-[25px] [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:scroll-mt-28 [&_h3]:font-bold [&_h3]:text-[18px] [&_h3]:leading-[25px] [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc"
    >
      <SafeHtml :html="html" />
    </div>
    <div class="mx-auto mt-10 max-w-[994px] border-t border-brand-blue/30" />
  </section>
</template>
