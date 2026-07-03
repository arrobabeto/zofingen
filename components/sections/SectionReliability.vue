<script setup lang="ts">
  import CheckCircle from "./_CheckCircle.vue"

  defineProps<{
    image: string
    titleTop: string
    titleItalic: string
    items: string[]
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:flex-row lg:gap-[62px]"
    >
      <div class="w-full shrink-0 lg:h-[790px] lg:w-[479px]">
        <img
          :src="image"
          alt=""
          class="h-[320px] w-full rounded-[10px] object-cover lg:h-full"
        />
      </div>

      <div class="flex w-full flex-col items-start gap-11 lg:w-[653px]">
        <h2 class="font-serif text-[42px] font-bold leading-[58px] text-brand-blue">
          <span class="block whitespace-pre-line">{{ titleTop }}</span>
          <span class="block whitespace-pre-line italic">{{ titleItalic }}</span>
        </h2>
        <span class="block h-[4px] w-[67px] bg-brand-blue" />

        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-6">
            <div
              v-for="(it, i) of items"
              :key="i"
              class="flex items-center gap-9"
            >
              <CheckCircle />
              <p class="font-serif text-[18px] leading-[25px] text-brand-blue">
                {{ it }}
              </p>
            </div>
          </div>
          <a
            :href="ctaHref || '#'"
            class="flex h-16 w-[376px] max-w-full items-center justify-center rounded-[10px] bg-brand-blue text-center font-serif text-[18px] font-bold text-white transition hover:bg-brand-blue2"
          >
            {{ ctaLabel }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
