import { chromium } from "playwright"

const width = Number(process.argv[2] || 1400)
const out = process.argv[3] || "/tmp/home-dev.png"
const url = process.argv[4] || "http://localhost:3000/"

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width, height: 1000 },
  deviceScaleFactor: 1,
})
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
// scroll through to trigger any lazy loads
await page.evaluate(async () => {
  const step = 800
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 60))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(800)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log("saved", out)
