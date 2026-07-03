<script setup lang="ts">
  defineProps<{
    title: string
    columns: {
      groups: {
        title: string
        links: { label: string; href: string; text: string }[]
      }[]
    }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-24 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-6">
      <h2
        class="font-serif text-[40px] font-bold leading-[44px] text-brand-blue"
      >
        {{ title }}
      </h2>

      <div class="flex flex-col gap-9 lg:flex-row lg:gap-9">
        <div
          v-for="(col, ci) of columns"
          :key="ci"
          class="flex flex-1 flex-col gap-9"
        >
          <div
            v-for="(g, gi) of col.groups"
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
                v-for="(l, li) of g.links"
                :key="li"
                class="font-serif text-[18px] leading-[40px] text-brand-blue"
              >
                <span>{{ l.label }}&nbsp;</span>
                <a
                  :href="l.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-bold underline"
                >
                  {{ l.text }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
