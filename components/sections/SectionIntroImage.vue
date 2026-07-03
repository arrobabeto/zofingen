<script setup lang="ts">
  defineProps<{
    body: string
    image: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[120px]">
    <div class="mx-auto flex max-w-[1160px] flex-col items-center gap-16">
      <p
        class="max-w-[1161px] whitespace-pre-line text-center font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ body }}
      </p>
      <img
        :src="image"
        alt=""
        class="h-[378px] w-[784px] max-w-full rounded-[10px] object-cover"
      />
    </div>
  </section>
</template>
