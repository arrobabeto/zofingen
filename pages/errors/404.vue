<script setup lang="ts">
  import { useHead } from "#imports"

  useHead({
    title: "404 Page not found",
    meta: [
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  })
</script>

<template>
  <main
    class="grid min-h-screen place-content-center overflow-hidden bg-white font-sans text-black antialiased dark:bg-black dark:text-white"
  >
    <div class="space-y-4 text-center">
      <p class="text-2xl font-semibold">404 Page not found</p>
      <p class="text-sm opacity-80">The page you requested does not exist.</p>
      <NuxtLinkLocale to="/" class="underline">Go back home</NuxtLinkLocale>
    </div>
  </main>
</template>
