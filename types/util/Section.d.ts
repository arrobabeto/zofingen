/**
 * Section JSON for `pages.sections` / `posts.sections`.
 *
 * Key order matters for Orbitype CMS list UI: put a human-readable field first
 * (`title`, `name`, `label`, …). Never use `img` first (raw URLs). `_orbi` last.
 */
export type Section = {
  [key: string]: any
  _orbi: { component: string }
}
