<script setup lang="ts">
  import slug from "slug"
  import SectionHeading from "./_SectionHeading.vue"
  import { useTranslate } from "~/composables/useTranslate"
  import type { IPost } from "~/types/dto/IPost"

  defineProps<{
    title: string
  }>()

  const t = useTranslate()

  const rows = await $fetch<IPost[]>("/api/posts", {
    query: {
      status: "published",
      limit: 6,
      orderBy: "created_at",
      desc: true,
    },
  })

  const articles = rows.slice(0, 6).map((post) => ({
    title: t(post.title),
    image: post.img,
    href: `/posts/${post.id}/${slug(t(post.title))}`,
  }))
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-start gap-16">
      <SectionHeading :title="title" align="left" />
      <div v-if="articles.length" class="flex w-full flex-wrap justify-center gap-9">
        <NuxtLinkLocale
          v-for="(a, i) of articles"
          :key="i"
          :to="a.href"
          class="flex w-[376px] max-w-full flex-col transition hover:opacity-90"
        >
          <div class="h-[210px] overflow-hidden rounded-t-[10px]">
            <img :src="a.image" alt="" class="h-full w-full object-cover" />
          </div>
          <div
            class="flex flex-1 items-center justify-center rounded-b-[10px] bg-brand-blue px-4 py-8"
          >
            <p class="text-center font-serif text-[24px] font-bold text-white">
              {{ a.title }}
            </p>
          </div>
        </NuxtLinkLocale>
      </div>
    </div>
  </section>
</template>
