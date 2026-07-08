import { expect, test } from "@playwright/test"

test.describe("Mobile smoke", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("home has no horizontal overflow and mobile nav works", async ({
    page,
  }) => {
    await page.route("**/api/pages**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "mobile-home",
          title: { en: "Home", de: "Home" },
          slug: "home",
          img: "",
          keywords: ["home"],
          lead: { en: "Lead", de: "Lead" },
          sections: [
            {
              title: "Treuhand & Steuerberatung in Zofingen",
              subtitle: "Effizient, persönlich und zuverlässig",
              body: "Hero body text for mobile smoke test.",
              image: "/img/home/hero-bg.png",
              _orbi: { component: "SectionHero" },
            },
          ],
          head: {},
          created_at: new Date(0).toISOString(),
          updated_at: new Date(0).toISOString(),
        }),
      })
    })

    await page.goto("/")

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth > doc.clientWidth + 1
    })
    expect(overflow).toBe(false)

    await expect(
      page.getByRole("heading", { name: /Treuhand & Steuerberatung/i }),
    ).toBeVisible()

    const menuButton = page.getByRole("button", { name: "Menü öffnen" })
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    await expect(page.getByRole("link", { name: "Kontakt" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "KMU" })).toBeVisible()
  })

  test("blog sections render without horizontal overflow", async ({ page }) => {
    await page.route("**/api/pages**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "mobile-home",
          title: { en: "Home", de: "Home" },
          slug: "home",
          img: "",
          keywords: ["home"],
          lead: { en: "Lead", de: "Lead" },
          sections: [
            {
              title: "Artikel",
              image: "/img/artikel/hero-bg.png",
              _orbi: { component: "SectionPageHero" },
            },
            {
              featured: {
                title: "Featured Artikel",
                date: "01.01.2024",
                excerpt: "Kurztext",
                image: "/img/artikel/hero-bg.png",
                href: "/posts/test/featured",
              },
              articles: [],
              page: 1,
              _orbi: { component: "SectionArtikelFeed" },
            },
          ],
          head: {},
          created_at: new Date(0).toISOString(),
          updated_at: new Date(0).toISOString(),
        }),
      })
    })

    await page.goto("/")

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth > doc.clientWidth + 1
    })
    expect(overflow).toBe(false)

    await expect(page.getByRole("heading", { name: "Featured Artikel" })).toBeVisible()
  })
})
