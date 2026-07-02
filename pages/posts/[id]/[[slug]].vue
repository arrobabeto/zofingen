<script setup lang="ts">
  import { showError, useSeoMeta } from "#app"
  import { useHead, useI18n, useRoute, useRuntimeConfig } from "#imports"
  import { useTranslate } from "~/composables/useTranslate"
  import { useCanonicalLinks } from "~/composables/useCanonicalLinks"
  import { fn } from "~/functions/fn"
  import type { IPost } from "~/types/dto/IPost"
  import type { IComment } from "~/types/dto/IComment"
  import { dt } from "~/functions/dt"
  import InputV from "~/components/common/InputV.vue"
  import ButtonV from "~/components/common/ButtonV.vue"
  import { reactive } from "vue"
  import SafeHtml from "~/components/common/SafeHtml.vue"
  import { generateOGImageUrl } from "~/utils/ogImageGenerator"

  const t = useTranslate()
  const { locale } = useI18n()
  const config = useRuntimeConfig()

  const route = useRoute()
  const id = route.params["id"]
  const commentsEnabled = config.public.commentsEnabled

  const post: IPost = await $fetch("/api/posts", { query: { id } })
  if (!post)
    throw showError({ statusCode: 404, statusMessage: "Post not found" })
  const localizedLead = t(post.lead as any)
  const plainLead = fn.removeHtml(localizedLead)

  const comments = reactive<IComment[]>([])
  if (commentsEnabled) {
    const rows = await $fetch<IComment[]>("/api/comments", {
      query: { post_id: id },
    })
    comments.push(...rows)
  }

  const newComment = reactive<Partial<IComment>>({
    text: "",
    post_id: id,
  })

  async function onSubmit() {
    if (!commentsEnabled) return

    try {
      const resp: IComment = await $fetch("/api/comments", {
        method: "POST",
        body: newComment,
      })
      newComment.text = ""
      comments.unshift(resp)
    } catch (e) {
      alert(e)
    }
  }

  const isGermanPage = route.path === "/de" || route.path.startsWith("/de/")
  const enPath = route.path.startsWith("/de/")
    ? route.path.slice(3) || "/"
    : route.path
  const dePath = enPath === "/" ? "/de" : `/de${enPath}`
  const canonicalPath = isGermanPage ? dePath : enPath
  const canonicalUrl = `${config.public.siteUrl}${canonicalPath}`
  const title = t(post.title)
  const description = fn.truncateText(plainLead, 160)
  const ogImage = config.public.ogImageEnabled
    ? generateOGImageUrl({
        title,
        description: plainLead,
        image: post.img,
        type: "post",
      })
    : post.img

  useSeoMeta({
    title,
    description,
    author: config.public.organizationName,
    ogTitle: title,
    ogDescription: description,
    ogType: "article",
    ogImage,
    ogUrl: canonicalUrl,
    ogSiteName: config.public.siteName,
    ogLocale: locale.value === "de" ? "de_DE" : "en_US",
    articlePublishedTime: post.created_at,
    articleModifiedTime: post.updated_at,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    twitterSite: config.public.twitterSite,
    twitterCreator: config.public.twitterCreator,
  })

  useHead({
    link: useCanonicalLinks({
      canonicalPath,
      enPath,
      dePath,
      xDefaultPath: enPath,
    }),
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          datePublished: post.created_at,
          dateModified: post.updated_at,
          inLanguage: locale.value === "de" ? "de" : "en",
          url: canonicalUrl,
          image: {
            "@type": "ImageObject",
            url: ogImage,
            width: "1200",
            height: "630",
          },
          author: {
            "@type": "Organization",
            name: config.public.organizationName,
          },
          publisher: {
            "@type": "Organization",
            name: config.public.organizationName,
            logo: {
              "@type": "ImageObject",
              url: config.public.organizationLogo,
            },
          },
          mainEntityOfPage: canonicalUrl,
        }),
      },
    ],
  })
</script>

<template>
  <main class="max-w-3xl mx-auto w-full space-y-5 p-4 sm:py-8">
    <NuxtLinkLocale
      to="/posts"
      class="inline-flex items-center rounded-lg border border-[#e0e0e0] bg-[#fefefe] px-3 py-1.5 text-sm text-[#010101] hover:bg-[#f6f6f6] dark:border-[#282a36] dark:bg-[#191a22] dark:text-[#fefefe] dark:hover:bg-[#22232b]"
    >
      ← back
    </NuxtLinkLocale>

    <article
      class="rounded-2xl border border-[#e0e0e0] bg-[#fefefe]/95 p-5 shadow-sm dark:border-[#282a36] dark:bg-[#191a22]/95"
    >
      <h1
        class="text-2xl font-semibold leading-tight text-[#010101] dark:text-[#fefefe]"
      >
        {{ t(post.title) }}
      </h1>
      <time class="mt-2 block text-xs text-[#4e4e4e] dark:text-[#cbcbcb]">
        {{ dt.toLocal(post.created_at) }}
      </time>
      <div class="prose prose-sm dark:prose-invert mt-4 max-w-none">
        <SafeHtml :html="localizedLead" />
      </div>
    </article>

    <ul
      v-if="commentsEnabled"
      class="space-y-2 rounded-2xl border border-[#e0e0e0] bg-[#fefefe]/95 p-4 dark:border-[#282a36] dark:bg-[#191a22]/95"
    >
      <li v-for="c of comments" :key="c.id">
        <p class="text-sm text-[#010101] dark:text-[#fefefe]">{{ c.text }}</p>
      </li>
    </ul>

    <form v-if="commentsEnabled" @submit.prevent="onSubmit" class="flex gap-2">
      <InputV
        v-model="newComment.text"
        placeholder="new comment"
        required
        class="grow"
      />
      <ButtonV submit>Send</ButtonV>
    </form>
  </main>
</template>
