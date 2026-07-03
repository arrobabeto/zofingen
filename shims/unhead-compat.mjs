// Compatibility shim: unhead v2 removed the `getActiveHead` named export from
// its main entry, but @nuxtjs/i18n@8 still imports it from "unhead", which
// crashes client hydration. We re-export the full unhead v2 API plus the
// legacy `getActiveHead` so the bare "unhead" specifier stays a superset.
// The main entry is referenced by relative path to bypass the package
// `exports` restriction and avoid recursing through the alias.
export * from "../node_modules/unhead/dist/index.mjs"
export { getActiveHead } from "unhead/legacy"
