<script setup lang="ts">
  import Navigation from "~/layouts/components/Navigation.vue"
  import Footer from "~/layouts/components/Footer.vue"
  import FormToast from "~/components/common/FormToast.vue"
</script>

<template>
  <div
    class="flex min-h-[100dvh] flex-col bg-white font-serif text-brand-blue"
  >
    <Navigation />
    <div class="flex-grow">
      <slot />
    </div>
    <Footer />
    <FormToast />
  </div>
</template>
