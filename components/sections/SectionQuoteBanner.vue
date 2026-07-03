<script setup lang="ts">
  defineProps<{
    text: string
  }>()
</script>

<template>
  <section class="w-full py-16">
    <div class="flex w-full items-center justify-center bg-brand-card px-6 py-16">
      <p
        class="text-center font-serif text-[24px] italic leading-normal text-brand-blue"
      >
        {{ text }}
      </p>
    </div>
  </section>
</template>
