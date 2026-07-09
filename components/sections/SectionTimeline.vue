<script setup lang="ts">
  import CheckCircle from "./_CheckCircle.vue"
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    steps: { title: string; body: string }[]
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
      <SectionHeading :title="title" />

      <!-- Mobile: vertical timeline -->
      <div class="timeline-mobile relative w-full lg:hidden">
        <span
          class="absolute bottom-0 left-[33px] top-0 w-px bg-brand-light"
          aria-hidden="true"
        />
        <div class="flex flex-col gap-8">
          <div
            v-for="(s, i) of steps"
            :key="i"
            class="relative flex gap-4"
          >
            <div
              class="relative z-[1] flex h-[67px] w-[67px] shrink-0 items-center justify-center rounded-full border-2 border-brand-light bg-brand-card"
            >
              <CheckCircle class="text-brand-blue" />
            </div>
            <div class="min-w-0 flex-1 pt-2">
              <p class="mb-3 font-serif text-[18px] text-brand-blue">
                Schritt {{ i + 1 }}
              </p>
              <div
                class="w-full rounded-[10px] border border-brand-blue bg-white px-5 py-6 text-center"
              >
                <p class="font-serif text-[20px] font-bold text-brand-blue">
                  {{ s.title }}
                </p>
                <p
                  class="mt-4 font-serif text-[16px] leading-[24px] text-brand-grey"
                >
                  {{ s.body }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: alternating timeline (unchanged) -->
      <div class="relative hidden w-full max-w-[1080px] lg:block">
        <span
          class="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-light"
        />
        <div class="flex flex-col gap-12">
          <div
            v-for="(s, i) of steps"
            :key="i"
            class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8"
          >
            <div class="flex justify-end">
              <span
                v-if="i % 2 === 0"
                class="font-serif text-[18px] text-brand-blue"
              >
                Schritt {{ i + 1 }}
              </span>
              <div
                v-else
                class="w-full max-w-[479px] rounded-[10px] border border-brand-blue bg-white px-8 py-8 text-center"
              >
                <p class="font-serif text-[24px] font-bold text-brand-blue">
                  {{ s.title }}
                </p>
                <p
                  class="mt-6 font-serif text-[18px] leading-[25px] text-brand-grey"
                >
                  {{ s.body }}
                </p>
              </div>
            </div>

            <div
              class="flex h-[67px] w-[67px] items-center justify-center rounded-full border-2 border-brand-light bg-brand-card"
            >
              <CheckCircle class="text-brand-blue" />
            </div>

            <div class="flex justify-start">
              <div
                v-if="i % 2 === 0"
                class="w-full max-w-[479px] rounded-[10px] border border-brand-blue bg-white px-8 py-8 text-center"
              >
                <p class="font-serif text-[24px] font-bold text-brand-blue">
                  {{ s.title }}
                </p>
                <p
                  class="mt-6 font-serif text-[18px] leading-[25px] text-brand-grey"
                >
                  {{ s.body }}
                </p>
              </div>
              <span
                v-else
                class="font-serif text-[18px] text-brand-blue"
              >
                Schritt {{ i + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
