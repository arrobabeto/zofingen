<script setup lang="ts">
  import Navigation from "~/layouts/components/Navigation.vue"
  import Footer from "~/layouts/components/Footer.vue"
</script>

<template>
  <div
    class="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#faf1e3] to-[#e4f1ff] text-[#010101] dark:from-[#2b5876] dark:to-[#16222a] dark:text-[#fefefe]"
  >
    <Navigation />
    <div class="flex-grow">
      <slot />
    </div>
    <Footer />
  </div>
</template>
