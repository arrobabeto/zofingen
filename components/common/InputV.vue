<script setup lang="ts">
  const p = defineProps<{
    label?: string | number
    placeholder?: string
    type?: "text" | "number" | "email" | "password" | "date"
    required?: boolean
    disabled?: boolean
  }>()

  const modelValue = defineModel<any>()
</script>

<template>
  <label>
    <span v-if="label" class="block pb-1">{{ label }}</span>
    <input
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder ?? ''"
      :disabled="disabled"
      :required="required"
      class="h-10 border px-2"
    />
  </label>
</template>
