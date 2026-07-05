<script setup lang="ts">
  import type { ArticleTocItem } from "~/composables/useArticleToc"

  defineProps<{
    items: ArticleTocItem[]
  }>()
</script>

<template>
  <nav
    v-if="items.length >= 2"
    class="w-full px-6 pt-3 lg:px-[100px]"
    aria-label="Inhaltsverzeichnis"
  >
    <div
      class="mx-auto max-w-[1099px] rounded-[10px] border border-brand-card bg-brand-card/40 p-6"
    >
      <p
        class="mb-4 font-serif text-[18px] font-bold leading-[25px] text-brand-blue"
      >
        Inhaltsverzeichnis
      </p>
      <ol class="flex flex-col gap-2">
        <li
          v-for="(item, i) of items"
          :key="item.id"
          class="font-serif text-[18px] leading-[25px] text-brand-blue"
          :class="item.level === 3 ? 'ml-5' : ''"
        >
          <a
            :href="`#${item.id}`"
            class="inline-flex gap-2 hover:underline"
          >
            <span class="font-bold">{{ i + 1 }}.</span>
            {{ item.text }}
          </a>
        </li>
      </ol>
    </div>
  </nav>
</template>
