<script setup lang="ts">
  import { computed, ref, watch } from "vue"
  import type { IPost } from "~/types/dto/IPost"
  import ButtonV from "~/components/common/ButtonV.vue"
  import { dt } from "~/functions/dt"
  import { useHead } from "#imports"
  import { useTranslate } from "~/composables/useTranslate"
  import slug from "slug"
  import { useI18n } from "#i18n"
  import { Store } from "~/services/Store"
  import Widget from "./_Widget.vue"

  const t = useTranslate()

  const { locale, locales, setLocale } = useI18n()

  const posts = ref<IPost[]>([])
  const pagination = ref(0)
  const postsPerPage = 2
  const hasMore = ref(false)
  const isLoading = ref(false)
  const localeCodes = computed(() =>
    locales.value.map((x) => (typeof x === "string" ? x : x.code)),
  )

  async function load() {
    isLoading.value = true
    try {
      const rows = await $fetch<IPost[]>("/api/posts", {
        query: {
          status: "published",
          limit: postsPerPage + 1,
          offset: pagination.value * postsPerPage,
          orderBy: "created_at",
          desc: true,
        },
      })
      hasMore.value = rows.length > postsPerPage
      posts.value = rows.slice(0, postsPerPage)
    } finally {
      isLoading.value = false
    }
  }

  function goPrev() {
    pagination.value = Math.max(0, pagination.value - 1)
  }

  function goNext() {
    if (!hasMore.value) return
    pagination.value += 1
  }

  async function switchLocale(code: string) {
    await setLocale(code)
  }

  await load()
  watch(pagination, load)

  useHead({ title: "posts" })
</script>

<template>
  <main class="max-w-3xl mx-auto w-full space-y-5 p-4 sm:py-8">
    <header class="space-y-1">
      <p
        class="text-xs font-semibold uppercase tracking-[0.2em] text-[#1384ff]"
      >
        Blog
      </p>
      <h1 class="text-2xl font-semibold text-[#010101] dark:text-[#fefefe]">
        Latest Posts
      </h1>
    </header>

    <!-- example pagination -->
    <NuxtLinkLocale
      v-for="p of posts"
      :key="p.id"
      :to="`/posts/${p.id}/${slug(t(p.title))}`"
      class="block rounded-2xl border border-[#e0e0e0] bg-[#fefefe]/95 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-[#282a36] dark:bg-[#191a22]/95"
    >
      <h2
        class="line-clamp-2 text-lg font-medium text-[#010101] dark:text-[#fefefe]"
      >
        {{ t(p.title) }}
      </h2>
      <time class="mt-2 block text-xs text-[#4e4e4e] dark:text-[#cbcbcb]">
        {{ dt.toLocal(p.created_at) }}
      </time>
    </NuxtLinkLocale>

    <!-- example pagination -->
    <div class="grid grid-cols-3 gap-2 pt-2">
      <ButtonV :disabled="pagination === 0 || isLoading" @click="goPrev">
        prev
      </ButtonV>
      <ButtonV @click="pagination = 0">{{ pagination }}</ButtonV>
      <ButtonV :disabled="!hasMore || isLoading" @click="goNext">next</ButtonV>
    </div>

    <!-- example lang switcher -->
    <div class="flex justify-center divide-x px-2 children:px-2">
      <button
        v-for="l of localeCodes"
        :key="l"
        @click="switchLocale(l)"
        :class="locale === l ? 'font-bold' : ''"
      >
        {{ l.toUpperCase() }}
      </button>
    </div>

    <!-- other examples -->
    <hr class="border-[#e0e0e0] dark:border-[#282a36]" />
    <button
      class="rounded-xl border border-[#e0e0e0] bg-[#fefefe] px-3 py-2 text-sm text-[#010101] dark:border-[#282a36] dark:bg-[#191a22] dark:text-[#fefefe]"
      @click="Store.counter++"
    >
      Store.counter: {{ Store.counter }}
    </button>
    <Widget />
  </main>
</template>
