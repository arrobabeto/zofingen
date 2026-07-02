<script setup lang="ts">
  import { ref } from "vue"
  import ButtonV from "~/components/common/ButtonV.vue"

  const p = defineProps<{
    start?: number
  }>()

  const count = ref(p.start ?? 0)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }
</script>

<template>
  <div class="flex gap-2">
    <ButtonV @click="decrement">--</ButtonV>
    <ButtonV @click="reset" class="grow">{{ count }}</ButtonV>
    <ButtonV @click="increment">++</ButtonV>
  </div>
</template>
