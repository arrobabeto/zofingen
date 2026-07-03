<script setup lang="ts">
  import CheckCircle from "./_CheckCircle.vue"

  defineProps<{
    image: string
    title: string
    body: string
    benefitsTitle: string
    benefits: string[]
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[120px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:flex-row lg:gap-[130px]"
    >
      <img
        :src="image"
        alt=""
        class="h-[683px] w-full shrink-0 rounded-[10px] object-cover lg:w-[374px]"
      />
      <div class="flex flex-col gap-8 lg:w-[651px]">
        <h2
          class="font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
        >
          {{ title }}
        </h2>
        <span class="block h-[4px] w-[67px] bg-brand-blue" />
        <p
          class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ body }}
        </p>
        <p class="font-serif text-[24px] font-bold text-brand-blue">
          {{ benefitsTitle }}
        </p>
        <div class="flex flex-col gap-11">
          <div
            v-for="(b, i) of benefits"
            :key="i"
            class="flex items-start gap-6"
          >
            <CheckCircle class="mt-1" />
            <p class="font-serif text-[18px] leading-[25px] text-brand-blue">
              {{ b }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
