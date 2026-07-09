<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"
  import SectionHeading from "./_SectionHeading.vue"

  type Plan = {
    name: string
    currency: string
    price: string
    features: string[]
    ctaLabel: string
    ctaHref?: string
    featured?: boolean
    badge?: string
    footnoteTitle?: string
    footnoteItems?: string[]
  }

  defineProps<{
    title: string
    intro: string
    plans: Plan[]
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
      <div class="flex w-full max-w-[994px] flex-col items-center gap-6">
        <SectionHeading :title="title" />
        <p
          class="text-center font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ intro }}
        </p>
      </div>

      <div
        class="flex w-full flex-col items-stretch justify-center gap-9 lg:flex-row lg:items-start"
      >
        <div
          v-for="(plan, i) of plans"
          :key="i"
          class="flex w-full flex-col gap-6 lg:w-[582px]"
        >
          <div
            class="relative flex flex-col items-center gap-6 overflow-hidden rounded-[10px] border border-brand-blue p-6 lg:gap-8 lg:p-8"
            :class="plan.featured ? 'bg-brand-blue' : 'bg-white'"
          >
            <span
              v-if="plan.badge"
              class="absolute -right-[42px] top-[26px] w-[170px] rotate-45 bg-brand-light py-1 text-center font-serif text-[14px] font-bold text-brand-blue shadow-sm lg:text-[16px]"
            >
              {{ plan.badge }}
            </span>

            <p
              class="font-serif text-[24px] font-bold"
              :class="plan.featured ? 'text-white' : 'text-brand-blue'"
            >
              {{ plan.name }}
            </p>

            <div
              class="flex flex-col items-center leading-none"
              :class="plan.featured ? 'text-white' : 'text-brand-blue'"
            >
              <span class="font-serif text-[24px] font-bold">
                {{ plan.currency }}
              </span>
              <span class="font-serif text-[48px] font-bold leading-[0.9] lg:text-[80px]">
                {{ plan.price }}
              </span>
            </div>

            <ul
              class="w-full list-disc space-y-1 pl-6 font-serif text-[16px] leading-[24px] lg:text-[18px] lg:leading-[25px]"
              :class="plan.featured ? 'text-white' : 'text-brand-blue'"
            >
              <li v-for="(f, fi) of plan.features" :key="fi">{{ f }}</li>
            </ul>

            <SectionButton
              :label="plan.ctaLabel"
              :href="plan.ctaHref"
              :invert="plan.featured"
              size="medium"
            />
          </div>

          <div
            v-if="plan.footnoteTitle"
            class="font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            <p class="font-bold">{{ plan.footnoteTitle }}</p>
            <ul class="list-disc pl-6">
              <li v-for="(f, fi) of plan.footnoteItems" :key="fi">{{ f }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
