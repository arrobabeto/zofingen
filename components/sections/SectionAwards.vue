<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    images: string[]
    body: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-8">
      <div class="w-[788px] max-w-full">
        <SectionHeading :title="title" align="center" />
      </div>
      <div
        class="flex w-full flex-col items-center gap-[60px] lg:flex-row lg:justify-center"
      >
        <div class="flex shrink-0 items-center gap-4">
          <img
            v-for="(src, i) of images"
            :key="i"
            :src="src"
            alt=""
            class="h-[280px] w-[200px] object-cover shadow-[0px_0px_12px_5px_rgba(0,0,0,0.05)]"
          />
        </div>
        <p
          class="w-full whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue lg:w-[507px] lg:text-right"
        >
          {{ body }}
        </p>
      </div>
    </div>
  </section>
</template>
