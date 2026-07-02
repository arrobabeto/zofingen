<script setup lang="ts">
  import sanitizeHtml from "sanitize-html"

  const p = defineProps<{
    html: string
  }>()
</script>

<template>
  <!--eslint-disable vue/no-v-html-->
  <div v-html="sanitizeHtml(html)" />
</template>
