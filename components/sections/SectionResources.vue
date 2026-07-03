<script setup lang="ts">
  defineProps<{
    groups: {
      title: string
      items: { label: string; href?: string }[]
    }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-9">
      <div
        v-for="(g, gi) of groups"
        :key="gi"
        class="flex flex-col gap-2"
      >
        <p
          class="font-serif text-[20px] font-bold leading-[25px] text-brand-blue"
        >
          {{ g.title }}
        </p>
        <ul class="flex flex-col">
          <li
            v-for="(it, i) of g.items"
            :key="i"
            class="font-serif text-[18px] leading-[40px] text-brand-blue"
          >
            <a
              v-if="it.href"
              :href="it.href"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
            >
              {{ it.label }}
            </a>
            <span v-else>{{ it.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
