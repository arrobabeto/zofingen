import { expect, test } from "@playwright/test"

test.describe("Homepage smoke", () => {
  test("renders home, supports /de, and expands next steps", async ({
    page,
  }) => {
    await page.route("**/api/pages**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "smoke-home",
          title: {
            en: "Orbitype Headless CMS Template",
            de: "Orbitype Headless CMS Template",
          },
          slug: "home",
          img: "",
          keywords: ["orbitype", "smoke"],
          lead: {
            en: "Smoke test lead",
            de: "Smoke test lead",
          },
          sections: [
            {
              title: {
                en: "Welcome to the Orbitype Headless CMS Template",
                de: "Welcome to the Orbitype Headless CMS Template",
              },
              lead: {
                en: "Start here",
                de: "Start here",
              },
              capabilities: [
                {
                  title: { en: "Smoke capability", de: "Smoke capability" },
                  text: { en: "Smoke text", de: "Smoke text" },
                },
              ],
              steps: [
                {
                  title: { en: "Step one", de: "Step one" },
                  text: { en: "Step one details", de: "Step one details" },
                },
              ],
              _orbi: { component: "SectionWelcome" },
            },
          ],
          head: {},
          created_at: new Date(0).toISOString(),
          updated_at: new Date(0).toISOString(),
        }),
      })
    })

    await page.goto("/")

    const homeHeading = page.getByRole("heading", {
      name: /Orbitype Headless CMS Template/i,
    })
    await expect(homeHeading).toBeVisible()

    await page.goto("/de")
    await expect(homeHeading).toBeVisible()

    const firstStep = page.locator("details").first()
    await expect(firstStep).not.toHaveAttribute("open", "")

    await firstStep.locator("summary").click()
    await expect(firstStep).toHaveAttribute("open", "")
  })

  test("serves robots, sitemaps, and llms routes", async ({
    page,
    request,
  }) => {
    await page.goto("/")

    const robotsResponse = await request.get("/robots.txt")
    expect(robotsResponse.ok()).toBeTruthy()
    const robotsBody = await robotsResponse.text()
    expect(robotsBody).toContain("Sitemap:")
    expect(robotsBody).toContain("LLMs-Txt:")

    const sitemapResponse = await request.get("/sitemaps.xml")
    expect(sitemapResponse.ok()).toBeTruthy()
    const sitemapBody = await sitemapResponse.text()
    expect(sitemapBody).toContain("<sitemapindex")

    const llmsResponse = await request.get("/llms.txt")
    expect(llmsResponse.ok()).toBeTruthy()
    const llmsBody = await llmsResponse.text()
    expect(llmsBody).toContain("# Orbitype Headless CMS Template")

    const llmsFullResponse = await request.get("/llms-full.txt")
    expect(llmsFullResponse.ok()).toBeTruthy()
    const llmsFullBody = await llmsFullResponse.text()
    expect(llmsFullBody).toContain("(Full)")
  })
})
