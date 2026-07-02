<script setup lang="ts">
  const p = defineProps<{
    text: string
  }>()
</script>

<template>
  <section class="px-4 py-10">
    <blockquote
      class="max-w-3xl mx-auto w-full rounded-2xl border border-[#e0e0e0] bg-[#fefefe]/95 px-6 py-8 text-center text-xl font-semibold italic text-[#010101] shadow-sm sm:text-2xl dark:border-[#282a36] dark:bg-[#191a22]/95 dark:text-[#fefefe]"
    >
      «{{ text }}»
    </blockquote>
  </section>
</template>
