<script setup lang="ts">
  import sanitizeHtml from "sanitize-html"

  const p = defineProps<{
    html: string
  }>()

  function sanitizeArticleHtml(html: string) {
    return sanitizeHtml(html, {
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        h1: ["id"],
        h2: ["id"],
        h3: ["id"],
        h4: ["id"],
        h5: ["id"],
        h6: ["id"],
      },
    })
  }
</script>

<template>
  <!--eslint-disable vue/no-v-html-->
  <div v-html="sanitizeArticleHtml(html)" />
</template>
