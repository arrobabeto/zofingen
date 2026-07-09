<script setup lang="ts">
  import SafeHtml from "~/components/common/SafeHtml.vue"

  defineProps<{
    html: string
  }>()
</script>

<template>
  <section class="w-full px-6 lg:px-[100px]">
    <div
      class="article-body mx-auto max-w-[1099px] font-serif text-[16px] leading-[24px] text-brand-blue [&_a]:text-brand-blue [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:font-bold [&_h2]:text-[28px] [&_h2]:leading-[36px] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:scroll-mt-28 [&_h3]:font-bold [&_h3]:text-[22px] [&_h3]:leading-[30px] [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:scroll-mt-28 [&_h4]:font-bold [&_h4]:text-[20px] [&_h4]:leading-[28px] [&_h5]:mb-2 [&_h5]:mt-5 [&_h5]:font-bold [&_h5]:text-[18px] [&_h5]:leading-[26px] [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc"
    >
      <SafeHtml :html="html" />
    </div>
    <div class="mx-auto mt-10 max-w-[994px] border-t border-brand-blue/30" />
  </section>
</template>

<style scoped>
  .article-body :deep(figure) {
    margin: 1.5rem 0;
    overflow-x: auto;
  }

  .article-body :deep(table) {
    width: 100%;
    min-width: 28rem;
    border-collapse: collapse;
    font: inherit;
    color: inherit;
  }

  .article-body :deep(td),
  .article-body :deep(th) {
    border: 1px solid rgb(1 32 104 / 0.22);
    padding: 0.625rem 1rem;
    vertical-align: top;
    text-align: left;
  }

  .article-body :deep(tbody tr:first-child td),
  .article-body :deep(tbody tr:first-child th),
  .article-body :deep(thead th) {
    font-weight: 700;
    background-color: rgb(1 32 104 / 0.06);
  }
</style>
