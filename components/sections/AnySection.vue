<script setup lang="ts">
  import { computed } from "vue"
  import type { Section } from "~/types/util/Section"

  const imports = import.meta.glob("~/components/sections/*.vue", {
    eager: true,
  })
  const components = Object.values(imports).map((x: any) => x.default)

  const p = defineProps<{
    data: Section
  }>()

  function isComponentMatch(component: any) {
    return [component.__name, component.name].includes(p.data._orbi.component)
  }

  const sectionComponent = computed(() =>
    components.find((x) => isComponentMatch(x)),
  )

  const fallbackJson = computed(() => JSON.stringify(p.data, null, 2))
  const fallbackComponentName = computed(
    () => p.data?._orbi?.component ?? "unknown",
  )
  const fallbackKeys = computed(() => Object.keys(p.data ?? {}).length)
</script>

<template>
  <component v-if="sectionComponent" :is="sectionComponent" v-bind="data" />

  <section
    v-else
    class="max-w-5xl mx-auto my-6 w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#282a36] dark:bg-[#191a22]"
  >
    <div
      class="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] px-4 py-3 dark:border-[#282a36]"
    >
      <span
        class="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#374151] dark:border-[#3f3f46] dark:bg-[#111827] dark:text-[#d1d5db]"
      >
        Debug
      </span>
      <p class="text-sm font-semibold text-[#111827] dark:text-[#f3f4f6]">
        Missing section component
      </p>
      <code
        class="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-2 py-1 text-xs text-[#1f2937] dark:border-[#3f3f46] dark:bg-[#111827] dark:text-[#e5e7eb]"
      >
        {{ fallbackComponentName }}
      </code>
      <span class="ml-auto text-xs text-[#6b7280] dark:text-[#9ca3af]">
        {{ fallbackKeys }} keys
      </span>
    </div>

    <details class="group">
      <summary
        class="cursor-pointer select-none px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#6b7280] transition hover:text-[#374151] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]"
      >
        Section payload JSON
      </summary>
      <div class="px-4 pb-4">
        <pre
          class="max-h-[460px] overflow-auto rounded-md border border-[#e5e7eb] bg-[#0b1020] p-4 text-xs leading-6 text-[#e5e7eb] dark:border-[#3f3f46] dark:bg-[#0b1020]"
        ><code>{{ fallbackJson }}</code></pre>
      </div>
    </details>
  </section>
</template>
