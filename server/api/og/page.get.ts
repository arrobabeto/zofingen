import { ImageResponse } from "@vercel/og"
import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const siteName =
    process.env.NUXT_PUBLIC_SITE_NAME ?? "Orbitype Headless CMS Template"
  const logoPath =
    process.env.NUXT_PUBLIC_OG_LOGO_PATH ??
    "https://www.orbitype.com/assets/images/svg/orbitype-logo-hero.svg"
  const title =
    typeof query.title === "string" ? query.title : "Orbitype CMS Page"
  const description =
    typeof query.description === "string"
      ? query.description
      : "A production-ready starter for Orbitype-powered websites."

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "56px 64px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#111827",
        },
        children: [
          {
            type: "img",
            props: {
              src: logoPath,
              style: {
                width: "260px",
                height: "64px",
                objectFit: "contain",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "54px",
                      fontWeight: "700",
                      lineHeight: "1.1",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "28px",
                      lineHeight: "1.4",
                      color: "#475569",
                      maxWidth: "86%",
                    },
                    children: description,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: "26px",
                fontWeight: "600",
                color: "#334155",
              },
              children: siteName,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    },
  )
})
