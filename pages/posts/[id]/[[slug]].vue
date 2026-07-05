<script setup lang="ts">
  import { showError, useSeoMeta } from "#app"
  import { useHead, useI18n, useRoute, useRuntimeConfig } from "#imports"
  import { computed } from "vue"
  import { useTranslate } from "~/composables/useTranslate"
  import { useArticleToc } from "~/composables/useArticleToc"
  import { useCanonicalLinks } from "~/composables/useCanonicalLinks"
  import { fn } from "~/functions/fn"
  import type { IPost } from "~/types/dto/IPost"
  import type { I18nString } from "~/types/util/I18nString"
  import SectionPageHero from "~/components/sections/SectionPageHero.vue"
  import SectionArtikelHeader from "~/components/sections/SectionArtikelHeader.vue"
  import SectionArtikelToc from "~/components/sections/SectionArtikelToc.vue"
  import SectionArtikelContent from "~/components/sections/SectionArtikelContent.vue"
  import SectionArtikelRelated from "~/components/sections/SectionArtikelRelated.vue"
  import { generateOGImageUrl } from "~/utils/ogImageGenerator"

  const t = useTranslate()
  const { locale } = useI18n()
  const config = useRuntimeConfig()

  const route = useRoute()
  const id = route.params["id"]

  const post: IPost = await $fetch("/api/posts", { query: { id } })
  if (!post)
    throw showError({ statusCode: 404, statusMessage: "Post not found" })

  const contentSection = post.sections?.find(
    (s) => s._orbi?.component === "SectionArtikelContent",
  )
  const contentSource =
    (contentSection?.content as I18nString | undefined) ?? post.lead
  const rawContentHtml = t(contentSource)
  const { enrichedHtml, items: tocItems } = useArticleToc(rawContentHtml)

  const plainLead = fn.removeHtml(t(post.lead))

  const isGermanPage = route.path === "/de" || route.path.startsWith("/de/")
  const enPath = route.path.startsWith("/de/")
    ? route.path.slice(3) || "/"
    : route.path
  const dePath = enPath === "/" ? "/de" : `/de${enPath}`
  const canonicalPath = isGermanPage ? dePath : enPath
  const canonicalUrl = `${config.public.siteUrl}${canonicalPath}`
  const title = t(post.title)
  const description = fn.truncateText(plainLead, 160)
  const heroImage = computed(() => post.img || "/img/artikel/hero-bg.png")
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
  <main>
    <SectionPageHero title="Artikel" :image="heroImage" />
    <SectionArtikelHeader :title="post.title" :date="post.created_at" />
    <SectionArtikelToc :items="tocItems" />
    <SectionArtikelContent :html="enrichedHtml" />
    <SectionArtikelRelated :exclude-id="post.id" />
  </main>
</template>
