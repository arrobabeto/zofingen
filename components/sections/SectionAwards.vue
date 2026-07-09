<script setup lang="ts">
  import { ref } from "vue"
  import ImageLightbox from "./_ImageLightbox.vue"
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    images: string[]
    body: string
  }>()

  const lightboxSrc = ref<string | null>(null)

  function openLightbox(src: string) {
    lightboxSrc.value = src
  }

  function closeLightbox() {
    lightboxSrc.value = null
  }
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-8">
      <div class="w-[788px] max-w-full">
        <SectionHeading :title="title" align="center" />
      </div>
      <div
        class="flex w-full flex-col items-center gap-[60px] lg:flex-row lg:justify-center"
      >
        <div class="flex w-full flex-wrap items-center justify-center gap-3 lg:gap-4">
          <button
            v-for="(src, i) of images"
            :key="i"
            type="button"
            class="award-cert-button cursor-zoom-in border-0 bg-transparent p-0 shadow-[0px_0px_12px_5px_rgba(0,0,0,0.05)] transition hover:opacity-90"
            :aria-label="`Zertifikat ${i + 1} vergrössern`"
            @click="openLightbox(src)"
          >
            <img
              :src="src"
              alt=""
              class="h-auto max-h-[220px] w-auto max-w-[min(140px,28vw)] object-contain lg:max-h-[280px] lg:max-w-[200px]"
            />
          </button>
        </div>
        <p
          class="w-full whitespace-pre-line text-left font-serif text-[18px] leading-[25px] text-brand-blue lg:w-[507px] lg:text-right"
        >
          {{ body }}
        </p>
      </div>
    </div>
    <ImageLightbox
      :open="lightboxSrc !== null"
      :src="lightboxSrc ?? ''"
      @close="closeLightbox"
    />
  </section>
</template>
