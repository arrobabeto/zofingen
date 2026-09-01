type PreferredSourceClient = {
  init(options: { theme: "light" | "dark"; lang: string }): void
  addPreferredSource(): void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Window {
  dataLayer: any
  gtag: any
  PREFERRED_SOURCE?: ((client: PreferredSourceClient) => void)[]
}
