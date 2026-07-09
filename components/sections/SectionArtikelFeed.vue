<script setup lang="ts">
  import slug from "slug"
  import { ref, watch } from "vue"
  import SectionButton from "./_SectionButton.vue"
  import { useTranslate } from "~/composables/useTranslate"
  import { dt } from "~/functions/dt"
  import { fn } from "~/functions/fn"
  import type { IPost } from "~/types/dto/IPost"

  type ArtikelItem = {
    title: string
    date: string
    excerpt?: string
    image: string
    href: string
  }

  const props = defineProps<{
    page?: number
    pages?: number
    featured?: ArtikelItem
    articles?: ArtikelItem[]
  }>()

  const POSTS_PER_PAGE = 7

  const t = useTranslate()
  const currentPage = ref(props.page ?? 1)
  const featured = ref<ArtikelItem | null>(null)
  const articles = ref<ArtikelItem[]>([])
  const totalPages = ref(1)
  const isLoading = ref(false)

  function mapPost(post: IPost): ArtikelItem {
    return {
      title: t(post.title),
      date: dt.toArticle(post.created_at),
      excerpt: fn.truncateText(fn.removeHtml(t(post.lead)), 220),
      image: post.img || "/img/artikel/article-1.png",
      href: `/posts/${post.id}/${slug(t(post.title))}`,
    }
  }

  async function loadPosts() {
    isLoading.value = true
    try {
      const offset = (currentPage.value - 1) * POSTS_PER_PAGE
      const [rows, count] = await Promise.all([
        $fetch<IPost[]>("/api/posts", {
          query: {
            status: "published",
            limit: POSTS_PER_PAGE,
            offset,
            orderBy: "created_at",
            desc: true,
          },
        }),
        $fetch<number>("/api/posts", {
          query: { status: "published", count: "true" },
        }),
      ])

      totalPages.value = Math.max(1, Math.ceil(count / POSTS_PER_PAGE))
      const cards = rows.map(mapPost)
      featured.value = cards[0] ?? null
      articles.value = cards.slice(1)
    } finally {
      isLoading.value = false
    }
  }

  function goPrev() {
    if (currentPage.value > 1) currentPage.value--
  }

  function goNext() {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  await loadPosts()
  watch(currentPage, loadPosts)
</script>

<template>
  <section class="section-artikel-feed w-full px-6 pb-24 pt-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-20">
      <article
        v-if="featured"
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
              class="hidden font-serif font-bold text-brand-blue lg:block lg:text-[32px] lg:leading-[42px]"
            >
              {{ featured.title }}
            </h2>
            <h3
              class="font-serif text-[20px] font-bold leading-normal text-brand-blue lg:hidden"
            >
              {{ featured.title }}
            </h3>
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
            class="artikel-feed-btn"
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
          <SectionButton class="artikel-feed-btn" label="Mehr erfahren »" :href="a.href" narrow />
        </article>
      </div>

      <nav
        v-if="totalPages > 1"
        class="flex items-center justify-between"
        aria-label="Artikel Pagination"
      >
        <button
          type="button"
          class="artikel-pagination-btn inline-flex items-center gap-2 rounded-[10px] border border-brand-blue bg-white px-6 py-4 font-serif text-[18px] leading-[25px] text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage <= 1 || isLoading"
          @click="goPrev"
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
            v-for="p of totalPages"
            :key="p"
            class="h-3.5 w-3.5 rounded-full"
            :class="
              p === currentPage
                ? 'bg-brand-blue'
                : 'border border-brand-blue bg-white'
            "
          />
        </div>

        <button
          type="button"
          class="artikel-pagination-btn inline-flex items-center gap-2 rounded-[10px] border border-brand-blue bg-white px-6 py-4 font-serif text-[18px] leading-[25px] text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage >= totalPages || isLoading"
          @click="goNext"
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
