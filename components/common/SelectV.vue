<script setup lang="ts">
  const p = defineProps<{
    label?: string | number
    options: string[]
    texts?: string[]
    disabled?: boolean
  }>()

  const modelValue = defineModel<any>()
</script>

<template>
  <label>
    <span v-if="label" class="block pb-1">{{ label }}</span>
    <select
      v-model="modelValue"
      :disabled="disabled || options.length <= 1"
      class="h-10 border px-2"
    >
      <option v-for="(o, i) of options" :value="o" :key="o">
        {{ texts?.[i] ?? o }}
      </option>
    </select>
  </label>
</template>
