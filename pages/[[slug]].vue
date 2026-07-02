<script setup lang="ts">
  import { showError, useSeoMeta } from "#app"
  import {
    useHead,
    useI18n,
    useRoute,
    useRuntimeConfig,
    useTranslate,
  } from "#imports"
  import AnySection from "~/components/sections/AnySection.vue"
  import { useCanonicalLinks } from "~/composables/useCanonicalLinks"
  import { fn } from "~/functions/fn"
  import type { IPage } from "~/types/dto/IPage"
  import { generateOGImageUrl } from "~/utils/ogImageGenerator"

  const t = useTranslate()
  const { locale } = useI18n()
  const config = useRuntimeConfig()

  const route = useRoute()
  const routeSlug = route.params["slug"]
  const currentSlug = Array.isArray(routeSlug)
    ? routeSlug[0] || "home"
    : routeSlug || "home"
  const slug =
    route.path === "/de" && currentSlug === "de" ? "home" : currentSlug

  const page: IPage = await $fetch("/api/pages", { query: { slug } })
  if (!page)
    throw showError({ statusCode: 404, statusMessage: "Page not found" })

  const title = fn.truncateText(t(page.title), 60)
  const description = fn.truncateText(fn.removeHtml(t(page.lead)), 160)
  const keywords = Array.isArray(page.keywords) ? page.keywords.join(", ") : ""
  const isGermanPage = route.path === "/de" || route.path.startsWith("/de/")
  const enPath = page.slug === "home" ? "/" : `/${page.slug}`
  const dePath = page.slug === "home" ? "/de" : `/de/${page.slug}`
  const canonicalPath = isGermanPage ? dePath : enPath
  const canonicalUrl = `${config.public.siteUrl}${canonicalPath}`
  const ogImage = config.public.ogImageEnabled
    ? generateOGImageUrl({
        title: t(page.title),
        description: fn.removeHtml(t(page.lead)),
        image: page.img,
        type: "page",
      })
    : page.img

  useSeoMeta({
    title,
    description,
    keywords,
    author: config.public.organizationName,
    ogTitle: t(page.title),
    ogDescription: description,
    ogType: "website",
    ogImage,
    ogUrl: canonicalUrl,
    ogSiteName: config.public.siteName,
    ogLocale: locale.value === "de" ? "de_DE" : "en_US",
    twitterCard: "summary_large_image",
    twitterTitle: t(page.title),
    twitterDescription: description,
    twitterImage: ogImage,
    twitterSite: config.public.twitterSite,
    twitterCreator: config.public.twitterCreator,
  })

  useHead({
    ...page.head,
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
          "@type": "WebPage",
          name: t(page.title),
          headline: t(page.title),
          description,
          datePublished: page.created_at,
          dateModified: page.updated_at,
          inLanguage: locale.value === "de" ? "de" : "en",
          url: canonicalUrl,
          image: {
            "@type": "ImageObject",
            url: ogImage,
            width: "1200",
            height: "630",
          },
          mainEntity: {
            "@type": "Article",
            headline: t(page.title),
            description,
            datePublished: page.created_at,
            dateModified: page.updated_at,
            keywords,
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
          },
          isPartOf: {
            "@type": "WebSite",
            name: config.public.siteName,
            url: config.public.siteUrl,
          },
        }),
      },
    ],
  })
</script>

<template>
  <main v-if="page">
    <span class="sr-only">{{ t(page.title) }}</span>
    <AnySection
      v-for="(section, i) of page.sections"
      :key="i"
      :data="section"
    />
  </main>
</template>
