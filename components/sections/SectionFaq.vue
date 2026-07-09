<script setup lang="ts">
  import { ref } from "vue"

  const props = defineProps<{
    title: string
    items: { question: string; answer: string }[]
    defaultOpen?: number
  }>()

  const openIndex = ref<number | null>(props.defaultOpen ?? 0)

  function toggle(i: number) {
    openIndex.value = openIndex.value === i ? null : i
  }
</script>

<template>
  <section class="w-full px-6 py-12 lg:px-[100px] lg:py-24">
    <div class="mx-auto flex max-w-[1200px] flex-col items-start gap-16">
      <h2
        class="font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
      >
        {{ title }}
      </h2>

      <div class="flex w-full flex-col gap-5">
        <div
          v-for="(f, i) of items"
          :key="i"
          class="rounded-[10px] transition-colors"
          :class="
            openIndex === i
              ? 'border border-[#f6f6f6] bg-[#e4ecf5]'
              : 'border border-brand-blue bg-white'
          "
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-6 px-4 py-4 text-left lg:px-5 lg:py-5"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            <span class="font-serif text-[18px] font-bold leading-[25px] text-brand-blue">
              {{ f.question }}
            </span>
            <svg
              class="h-6 w-6 shrink-0 text-brand-blue transition-transform"
              :class="openIndex === i ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div
            v-if="openIndex === i"
            class="px-4 pb-6 lg:px-5 lg:pb-8"
          >
            <p
              class="max-w-[947px] font-serif text-[18px] leading-[25px] text-brand-blue"
            >
              {{ f.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
