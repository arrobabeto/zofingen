<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  withDefaults(
    defineProps<{
      title: string
      subtitle?: string
      body?: string
      ctaLabel?: string
      ctaHref?: string
      ctaSize?: "fit" | "medium" | "block" | "narrow"
      image: string
      video?: string
      align?: "left" | "center" | "right"
      compact?: boolean
    }>(),
    { align: "right" },
  )
</script>

<template>
  <section class="relative w-full overflow-hidden bg-brand-card">
    <video
      v-if="video"
      :src="video"
      :poster="image"
      autoplay
      muted
      loop
      playsinline
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <img
      v-else
      :src="image"
      alt=""
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <div
      class="absolute inset-0"
      :class="
        align === 'left'
          ? 'bg-gradient-to-r from-white via-white/70 to-transparent'
          : align === 'center'
            ? 'bg-gradient-to-b from-white via-white/80 to-white/50'
            : 'bg-gradient-to-l from-white via-white/70 to-transparent'
      "
    />
    <div class="relative w-full px-6 pb-16 pt-28 lg:px-[100px] lg:pt-32">
      <div
        class="hero-layout relative mx-auto flex max-w-[1200px] items-center"
        :class="[
          align === 'left'
            ? 'justify-start'
            : align === 'center'
              ? 'justify-center'
              : 'justify-end',
          compact ? 'min-h-[430px]' : 'min-h-[600px] lg:min-h-[741px]',
        ]"
      >
        <div
          class="hero-content flex w-[644px] max-w-full flex-col gap-8"
          :class="
            align === 'left'
              ? 'items-start text-left'
              : align === 'center'
                ? 'items-center text-center'
                : 'items-end text-right'
          "
        >
          <h1
            class="font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
          >
            {{ title }}
          </h1>
          <p v-if="subtitle" class="font-serif text-[24px] font-bold text-brand-blue">
            {{ subtitle }}
          </p>
          <p
            v-if="body"
            class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            {{ body }}
          </p>
          <SectionButton
            v-if="ctaLabel"
            :label="ctaLabel"
            :href="ctaHref"
            :size="ctaSize"
          />
        </div>
      </div>
    </div>
  </section>
</template>
