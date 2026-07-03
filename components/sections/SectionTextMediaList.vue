<script setup lang="ts">
  defineProps<{
    image: string
    body: string
    items: string[]
    reverse?: boolean
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:gap-9"
      :class="reverse ? 'lg:flex-row-reverse' : ''"
    >
      <img
        :src="image"
        alt=""
        class="h-[475px] w-full shrink-0 rounded-[10px] object-cover lg:w-[376px]"
      />
      <div class="flex w-full flex-col gap-6 lg:w-[582px]">
        <p
          class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ body }}
        </p>
        <ul
          class="list-disc space-y-2 pl-6 font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          <li v-for="(it, i) of items" :key="i">{{ it }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
