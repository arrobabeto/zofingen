<script setup lang="ts">
  defineProps<{
    title: string
    items: string[]
    image: string
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-24 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:gap-9"
    >
      <div class="flex w-full flex-col gap-11 lg:w-[479px]">
        <p class="font-serif text-[24px] font-bold text-brand-blue">
          {{ title }}
        </p>
        <ul
          class="list-disc space-y-4 pl-6 font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          <li v-for="(it, i) of items" :key="i">{{ it }}</li>
        </ul>
      </div>
      <img
        :src="image"
        alt=""
        class="h-[325px] w-full rounded-[10px] object-cover lg:w-[685px]"
      />
    </div>
  </section>
</template>
