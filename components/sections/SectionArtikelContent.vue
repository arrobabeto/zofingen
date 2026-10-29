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
  .article-body :deep(.table-scroll),
  .article-body :deep(figure) {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 1.5rem 0;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    touch-action: pan-x pan-y;
  }

  .article-body :deep(table) {
    width: max-content;
    min-width: 100%;
    max-width: none;
    border-collapse: collapse;
    font: inherit;
    color: inherit;
    margin-bottom: 0;
  }

  .article-body :deep(td),
  .article-body :deep(th) {
    border: 1px solid rgb(1 32 104 / 0.22);
    padding: 0.625rem 1rem;
    vertical-align: middle;
    text-align: left;
    /* Body rows: 14px. Header row overridden below to 16px. */
    font-size: 14px;
    line-height: 1.35;
  }

  .article-body :deep(td *),
  .article-body :deep(th *) {
    font-size: inherit;
    line-height: inherit;
  }

  /* Kill article paragraph margins inside cells (extra space below text) */
  .article-body :deep(td > *:first-child),
  .article-body :deep(th > *:first-child) {
    margin-top: 0;
  }

  .article-body :deep(td > *:last-child),
  .article-body :deep(th > *:last-child) {
    margin-bottom: 0;
  }

  .article-body :deep(td p),
  .article-body :deep(th p),
  .article-body :deep(td ul),
  .article-body :deep(th ul) {
    margin-top: 0;
    margin-bottom: 0;
  }

  /* Only the real header row — never thead AND first tbody row together */
  .article-body :deep(thead th),
  .article-body :deep(thead td) {
    font-size: 16px;
    line-height: 1.35;
    font-weight: 700;
    background-color: rgb(1 32 104 / 0.06);
  }

  /* Tables without <thead>: first body row is the header */
  .article-body :deep(table:not(:has(thead)) > tbody > tr:first-child > td),
  .article-body :deep(table:not(:has(thead)) > tbody > tr:first-child > th),
  .article-body :deep(table:not(:has(thead)) > tr:first-child > td),
  .article-body :deep(table:not(:has(thead)) > tr:first-child > th) {
    font-size: 16px;
    line-height: 1.35;
    font-weight: 700;
    background-color: rgb(1 32 104 / 0.06);
  }

  .article-body :deep(blockquote) {
    margin: 2rem 0 2.25rem;
    padding: 1.35rem 1.5rem 1.35rem 1.4rem;
    border-left: 4px solid currentColor;
    border-radius: 0 10px 10px 0;
    background-color: rgb(1 32 104 / 0.06);
  }

  .article-body :deep(blockquote p) {
    margin: 0;
    font-size: 18px;
    font-style: italic;
    font-weight: 500;
    line-height: 28px;
  }

  /* Sources block: title-sized heading with clear separation from previous section */
  .article-body :deep(h2#quellen) {
    margin-top: 4.5rem;
    margin-bottom: 1.25rem;
    font-size: 28px;
    line-height: 36px;
    font-weight: 700;
    scroll-margin-top: 7rem;
  }
</style>
