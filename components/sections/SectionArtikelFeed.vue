<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  type ArtikelItem = {
    title: string
    date: string
    excerpt?: string
    image: string
    href?: string
  }

  defineProps<{
    featured: ArtikelItem
    articles: ArtikelItem[]
    page?: number
    pages?: number
  }>()
</script>

<template>
  <section class="w-full px-6 pb-24 pt-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-20">
      <article
        class="flex flex-col gap-7 lg:flex-row lg:items-start"
      >
        <img
          :src="featured.image"
          alt=""
          class="h-[458px] w-full shrink-0 rounded-[16px] object-cover lg:w-[692px]"
        />
        <div class="flex flex-col gap-9 lg:w-[421px]">
          <div class="flex flex-col gap-4">
            <h2
              class="font-serif text-[32px] font-bold leading-[42px] text-brand-blue"
            >
              {{ featured.title }}
            </h2>
            <p
              class="flex items-center gap-3 font-serif text-[20px] leading-[25px] text-brand-blue"
            >
              {{ featured.date }}
              <span class="h-2 w-2 rounded-full bg-brand-blue" />
            </p>
          </div>
          <p
            v-if="featured.excerpt"
            class="font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            {{ featured.excerpt }}
          </p>
          <SectionButton
            label="Mehr erfahren »"
            :href="featured.href"
            narrow
          />
        </div>
      </article>

      <div
        v-for="(row, ri) of [articles.slice(0, 3), articles.slice(3, 6)].filter((r) => r.length)"
        :key="ri"
        class="flex flex-wrap justify-center gap-9 lg:justify-between"
      >
        <article
          v-for="(a, i) of row"
          :key="i"
          class="flex w-[376px] max-w-full flex-col gap-8"
        >
          <img
            :src="a.image"
            alt=""
            class="h-[256px] w-full rounded-[16px] object-cover"
          />
          <div class="flex flex-col gap-4">
            <h3
              class="font-serif text-[20px] font-bold leading-normal text-brand-blue"
            >
              {{ a.title }}
            </h3>
            <p
              class="flex items-center gap-3 font-serif text-[20px] leading-[25px] text-brand-blue"
            >
              {{ a.date }}
              <span class="h-2 w-2 rounded-full bg-brand-blue" />
            </p>
          </div>
          <SectionButton label="Mehr erfahren »" :href="a.href" narrow />
        </article>
      </div>

      <nav
        class="flex items-center justify-between"
        aria-label="Artikel Pagination"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-[10px] border border-brand-blue bg-white px-6 py-4 font-serif text-[18px] leading-[25px] text-slate-800"
        >
          <svg
            class="h-6 w-6 text-brand-blue"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Zurück
        </button>

        <div class="flex items-center gap-1">
          <span
            v-for="p in pages || 4"
            :key="p"
            class="h-3.5 w-3.5 rounded-full"
            :class="
              p === (page || 1)
                ? 'bg-brand-blue'
                : 'border border-brand-blue bg-white'
            "
          />
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-[10px] border border-brand-blue bg-white px-6 py-4 font-serif text-[18px] leading-[25px] text-slate-800"
        >
          Weiter
          <svg
            class="h-6 w-6 text-brand-blue"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  </section>
</template>
