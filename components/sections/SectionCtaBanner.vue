<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"
  import SectionHeading from "./_SectionHeading.vue"
  import VideoBackgroundOverlay from "./_VideoBackgroundOverlay.vue"

  defineProps<{
    background: string
    video?: string
    title: string
    body: string
    ctaLabel: string
    ctaHref?: string
    ctaSize?: "fit" | "medium" | "block" | "narrow"
  }>()
</script>

<template>
  <section class="relative w-full min-h-[280px] overflow-hidden lg:min-h-[360px]">
    <video
      v-if="video"
      :src="video"
      :poster="background"
      autoplay
      muted
      loop
      playsinline
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <img
      v-else
      :src="background"
      alt=""
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <VideoBackgroundOverlay v-if="video" />
    <div class="relative py-12 lg:py-20">
      <div
        class="relative mx-auto flex max-w-[1400px] flex-col px-6 lg:px-[100px]"
      >
        <div
          class="flex flex-col items-center gap-8 rounded-b-[10px] bg-white/90 px-6 py-12 text-center lg:px-[120px] lg:py-24"
        >
          <SectionHeading :title="title" align="center" />
          <p
            class="mx-auto max-w-[788px] whitespace-pre-line text-center font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            {{ body }}
          </p>
          <SectionButton
            :label="ctaLabel"
            :href="ctaHref"
            :size="ctaSize ?? 'fit'"
          />
        </div>
      </div>
    </div>
  </section>
</template>
