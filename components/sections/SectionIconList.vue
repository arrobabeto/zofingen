<script setup lang="ts">
  import CheckCircle from "./_CheckCircle.vue"

  defineProps<{
    image: string
    items: { title: string; body: string }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[120px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-12 lg:flex-row lg:gap-[70px]"
    >
      <img
        :src="image"
        alt=""
        class="h-[481px] w-[376px] max-w-full shrink-0 rounded-[10px] object-cover"
      />
      <div class="flex flex-col gap-8 lg:w-[548px]">
        <div
          v-for="(it, i) of items"
          :key="i"
          class="flex items-start gap-9"
        >
          <CheckCircle class="mt-1 text-brand-light" />
          <div class="flex flex-col gap-4">
            <p class="font-serif text-[24px] font-bold text-brand-blue">
              {{ it.title }}
            </p>
            <p
              class="font-serif text-[18px] leading-[25px] text-brand-blue"
            >
              {{ it.body }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
