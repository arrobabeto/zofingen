<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#imports"
  import { useI18n } from "#i18n"

  const { locale } = useI18n()
  const config = useRuntimeConfig()

  useHead({
    titleTemplate: (x) =>
      x ? `${x} | ${config.public.siteName}` : config.public.siteName,
    htmlAttrs: {
      lang: locale.value,
      class: "h-full",
    },
    bodyAttrs: {
      class: "h-full",
    },
    meta: [
      {
        name: "robots",
        content: "index,follow",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      {
        name: "description",
        content: config.public.siteDescription,
      },
      {
        name: "author",
        content: config.public.organizationName,
      },
      {
        name: "theme-color",
        content: "#012068",
      },
    ],
    link: [
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        href: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        href: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${config.public.siteUrl}/#organization`,
              name: config.public.organizationName,
              url: config.public.siteUrl,
              logo: {
                "@type": "ImageObject",
                url: config.public.organizationLogo.startsWith("http")
                  ? config.public.organizationLogo
                  : `${config.public.siteUrl}${config.public.organizationLogo}`,
              },
            },
            {
              "@type": "WebSite",
              "@id": `${config.public.siteUrl}/#website`,
              name: config.public.siteName,
              url: config.public.siteUrl,
              description: config.public.siteDescription,
              inLanguage: locale.value === "de" ? "de" : "en",
              publisher: {
                "@id": `${config.public.siteUrl}/#organization`,
              },
            },
          ],
        }),
      },
    ],
  })
</script>

<template>
  <!--eslint-disable vue/no-multiple-template-root-->
  <Head>
    <Link rel="preconnect" href="https://fonts.googleapis.com" />
    <Link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin="anonymous"
    />
    <Link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Fraunces:opsz,wght@9..144,400;9..144,500&display=swap"
    />
  </Head>

  <!-- Google Tag Manager (noscript) -->
  <noscript v-if="config.public.gtmId">
    <iframe
      :src="`https://www.googletagmanager.com/ns.html?id=${config.public.gtmId}`"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
    ></iframe>
  </noscript>
  <!-- End Google Tag Manager (noscript) -->

  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
