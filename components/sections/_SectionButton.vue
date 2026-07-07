<script setup lang="ts">
  import { computed } from "vue"

  type ButtonSize = "fit" | "medium" | "block" | "narrow"

  const props = withDefaults(
    defineProps<{
      label: string
      href?: string
      size?: ButtonSize
      invert?: boolean
      /** @deprecated use size="block" */
      block?: boolean
      /** @deprecated use size="narrow" */
      narrow?: boolean
    }>(),
    { size: "fit" },
  )

  const resolvedSize = computed<ButtonSize>(() => {
    if (props.block) return "block"
    if (props.narrow) return "narrow"
    return props.size
  })

  const sizeClass = computed(() => {
    switch (resolvedSize.value) {
      case "medium":
        return "h-16 min-w-[273px] w-auto px-6 py-4"
      case "block":
        return "h-16 w-[376px] max-w-full px-6 py-4"
      case "narrow":
        return "h-16 min-w-[271px] w-auto px-6 py-4"
      default:
        return "h-16 w-auto max-w-full px-8 py-4"
    }
  })
</script>

<template>
  <a
    :href="href || '#'"
    class="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-center font-serif text-[18px] font-bold leading-[25px] transition"
    :class="[
      sizeClass,
      invert
        ? 'border border-brand-blue bg-white text-brand-blue hover:bg-brand-card'
        : 'bg-brand-blue text-white hover:bg-brand-blue2',
    ]"
  >
    {{ label }}
  </a>
</template>
