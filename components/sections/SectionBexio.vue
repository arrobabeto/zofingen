<script setup lang="ts">
  defineProps<{
    title: string
    body: string
    image: string
  }>()
</script>

<template>
  <section class="w-full px-6 pt-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-6">
      <h2
        class="text-center font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
      >
        {{ title }}
      </h2>
      <p
        class="max-w-[752px] text-center font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ body }}
      </p>
      <img :src="image" alt="" class="h-[167px] w-[190px] object-contain" />
    </div>
  </section>
</template>
