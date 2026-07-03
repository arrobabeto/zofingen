<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  defineProps<{
    body: string
    question: string
    buttons: { label: string; href?: string }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[957px] flex-col items-center gap-10 text-center">
      <p
        class="max-w-[884px] font-serif text-[28px] leading-[36px] text-brand-blue"
      >
        {{ body }}
      </p>
      <p
        class="max-w-[764px] font-serif text-[28px] font-bold leading-[36px] text-brand-blue"
      >
        {{ question }}
      </p>
      <div class="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
        <SectionButton
          v-for="(b, i) of buttons"
          :key="i"
          :label="b.label"
          :href="b.href"
          class="w-full md:w-[405px]"
        />
      </div>
    </div>
  </section>
</template>
