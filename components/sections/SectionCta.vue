<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"
  import SectionButton from "./_SectionButton.vue"

  defineProps<{
    title: string
    body: string
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-6">
      <SectionHeading :title="title" align="center" />
      <p
        class="max-w-[766px] text-center font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ body }}
      </p>
      <SectionButton :label="ctaLabel" :href="ctaHref" />
    </div>
  </section>
</template>
