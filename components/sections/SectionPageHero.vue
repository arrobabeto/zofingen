<script setup lang="ts">
  withDefaults(
    defineProps<{
      title: string
      image: string
      body?: string
      align?: "left" | "center"
      large?: boolean
    }>(),
    { align: "center" },
  )
</script>

<template>
  <section class="relative w-full overflow-hidden bg-brand-card">
    <img
      :src="image"
      alt=""
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <div
      class="absolute inset-0"
      :class="
        align === 'left'
          ? 'bg-gradient-to-r from-white via-white/70 to-transparent'
          : 'bg-gradient-to-b from-white via-white/80 to-white/50'
      "
    />
    <div class="relative w-full px-6 pb-16 pt-28 lg:px-[100px] lg:pt-32">
      <div
        class="hero-layout relative mx-auto flex max-w-[1200px]"
        :class="[
          body ? 'min-h-[634px] items-end' : 'min-h-[507px] items-end',
          align === 'left' ? 'justify-start' : 'justify-center',
        ]"
      >
        <div
          class="hero-content flex max-w-[620px] flex-col gap-8"
          :class="align === 'left' ? 'items-start text-left' : 'items-center text-center'"
        >
          <h1
            class="font-serif font-bold text-brand-blue"
            :class="
              large
                ? 'text-[48px] leading-[58px]'
                : 'text-[42px] leading-[58px]'
            "
          >
            {{ title }}
          </h1>
          <p
            v-if="body"
            class="max-w-[577px] font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            {{ body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
