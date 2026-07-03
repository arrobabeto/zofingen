<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    quote: string
    author: string
    role: string
    image: string
  }>()
</script>

<template>
  <section class="w-full py-16">
    <div
      class="flex w-full flex-col items-center gap-9 bg-brand-card px-6 py-16 lg:px-[100px]"
    >
      <SectionHeading :title="title" align="center" />
      <div
        class="flex w-full max-w-[1200px] flex-col items-center justify-center gap-12 lg:flex-row lg:gap-[88px]"
      >
        <div class="flex items-center gap-9">
          <span class="select-none font-serif text-4xl text-brand-blue">‹</span>
          <div
            class="flex w-[477px] max-w-full items-center justify-center rounded-[20px] bg-white px-[18px] py-8 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)] lg:h-[370px]"
          >
            <div class="w-[437px] max-w-full font-serif text-brand-blue">
              <p class="text-[18px] leading-[25px]">{{ quote }}</p>
              <p class="mt-6 text-[18px] font-bold italic leading-[25px]">
                - {{ author }}
              </p>
              <p class="text-[18px] italic leading-[25px] text-brand-grey">
                {{ role }}
              </p>
            </div>
          </div>
          <span class="select-none font-serif text-4xl text-brand-blue">›</span>
        </div>
        <img
          :src="image"
          alt=""
          class="h-[278px] w-full rounded-[10px] object-cover lg:w-[582px]"
        />
      </div>
    </div>
  </section>
</template>
