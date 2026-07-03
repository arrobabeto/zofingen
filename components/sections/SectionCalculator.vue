<script setup lang="ts">
  withDefaults(
    defineProps<{
      title: string
      body: string
      ctaLabel: string
      ctaHref?: string
      dividers?: boolean
    }>(),
    { dividers: true },
  )
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1064px] flex-col items-center gap-16">
      <span v-if="dividers" class="h-px w-full bg-brand-blue/70" />
      <div class="flex w-full flex-col items-center gap-8">
        <h2
          class="whitespace-pre-line text-center font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
        >
          {{ title }}
        </h2>
        <div class="flex flex-col items-center gap-9 lg:flex-row">
          <p
            class="font-serif text-[18px] leading-[25px] text-brand-blue lg:w-[479px]"
          >
            {{ body }}
          </p>
          <a
            :href="ctaHref || '#'"
            class="flex h-16 w-[273px] max-w-full items-center justify-center rounded-[10px] bg-brand-blue text-center font-serif text-[18px] font-bold text-white transition hover:bg-brand-blue2"
          >
            {{ ctaLabel }}
          </a>
        </div>
      </div>
      <span v-if="dividers" class="h-px w-full bg-brand-blue/70" />
    </div>
  </section>
</template>
