<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    body: string
    ctaLabel: string
    ctaHref?: string
    photo: string
    name: string
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[120px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
      <SectionHeading :title="title" />

      <div
        class="flex w-full flex-col items-center justify-center gap-12 lg:flex-row lg:gap-[138px]"
      >
        <div class="flex w-full flex-col items-center gap-10 lg:w-[582px]">
          <div
            class="flex min-h-[232px] w-full items-center justify-center rounded-[10px] bg-white p-[32px] shadow-[2px_2px_4px_rgba(0,0,0,0.1)]"
          >
            <p class="font-serif text-[18px] leading-[25px] text-brand-blue">
              {{ body }}
            </p>
          </div>
          <SectionButton :label="ctaLabel" :href="ctaHref" />
        </div>

        <div class="flex w-[273px] max-w-full flex-col items-center gap-8">
          <img
            :src="photo"
            alt=""
            class="h-[273px] w-[273px] rounded-full object-cover"
          />
          <p
            class="text-center font-serif text-[24px] font-bold text-brand-blue"
          >
            {{ name }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
