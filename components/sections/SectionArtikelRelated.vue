<script setup lang="ts">
  import slug from "slug"
  import SectionButton from "./_SectionButton.vue"
  import { useTranslate } from "~/composables/useTranslate"
  import { dt } from "~/functions/dt"
  import type { IPost } from "~/types/dto/IPost"

  const p = defineProps<{
    excludeId: string
  }>()

  const t = useTranslate()

  const rows = await $fetch<IPost[]>("/api/posts", {
    query: {
      status: "published",
      limit: 4,
      orderBy: "created_at",
      desc: true,
    },
  })

  const articles = rows
    .filter((post) => post.id !== p.excludeId)
    .slice(0, 3)
    .map((post) => ({
      title: t(post.title),
      date: dt.toArticle(post.created_at),
      image: post.img,
      href: `/posts/${post.id}/${slug(t(post.title))}`,
    }))
</script>

<template>
  <section
    v-if="articles.length"
    class="w-full px-6 pb-24 pt-16 lg:px-[100px]"
  >
    <div class="mx-auto flex max-w-[1203px] flex-col gap-[52px]">
      <h2
        class="font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
      >
        Neuste Beiträge
      </h2>
      <div class="flex flex-wrap justify-center gap-9 lg:justify-between">
        <article
          v-for="(a, i) of articles"
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
              class="font-serif text-[24px] font-bold leading-normal text-brand-blue"
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
    </div>
  </section>
</template>
