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
    typeof query.title === "string" ? query.title : "Orbitype Blog Post"
  const description =
    typeof query.description === "string"
      ? query.description
      : "Insights and updates from your Orbitype CMS content."

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
          background: "linear-gradient(135deg, #fef3c7 0%, #dbeafe 100%)",
          padding: "56px 64px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#111827",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  type: "img",
                  props: {
                    src: logoPath,
                    style: {
                      width: "220px",
                      height: "56px",
                      objectFit: "contain",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#1e293b",
                    },
                    children: "Blog Post",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "56px",
                      fontWeight: "700",
                      lineHeight: "1.08",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "28px",
                      lineHeight: "1.35",
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
                fontSize: "24px",
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
