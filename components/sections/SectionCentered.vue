<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    body: string
    image?: string
    divider?: boolean
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1000px] flex-col items-center gap-8">
      <SectionHeading :title="title" align="center" :divider="divider ?? true" />
      <div
        class="whitespace-pre-line text-center font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ body }}
      </div>
      <div
        v-if="image"
        class="w-full overflow-hidden rounded-[10px] border-[1.5px] border-brand-blue"
      >
        <img
          :src="image"
          alt=""
          class="h-[561px] w-full object-cover"
        />
      </div>
    </div>
  </section>
</template>
