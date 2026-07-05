---
name: zofingen-rules
description: >-
  Zofingen Treuhand project coding standards, architecture, patterns, and UI
  guidelines. Use when unsure about conventions, reviewing code style, or
  looking up project rules synced from .cursor/rules/.
---

# Zofingen project rules

This skill indexes all project rules converted from `.cursor/rules/`.

## How to use

1. Identify the topic (architecture, patterns, UI, principles, etc.).
2. Read the matching file from `references/` in this skill directory.
3. Apply the guidelines to your current task.

Run `npm run sync:agent` after editing `.cursor/rules/` to refresh references.

## Rule index

### Meta (rules about rules)

- **Rule Naming and Organization** — `references/00-meta__00-naming.md`
- **General Principles** — `references/00-meta__01-general-principles.md`
- **Rule Structure and Format** — `references/00-meta__01-structure.md`

### Architecture

- **Technology Stack** — `references/10-architecture__01-base-stack.md`
- **Component Composition** — `references/10-architecture__02-composition.md`
- **Orbitype Headless CMS** — `references/10-architecture__03-orbitype-cms.md`

### Principles

- **Do Not Lie** — `references/20-principles__01-do-not-lie.md`
- **Prefer Vanilla** — `references/20-principles__02-prefer-vanilla.md`
- **Prefer Object-Oriented Programming** — `references/20-principles__03-prefer-oop.md`
- **Do Not Over-Engineer** — `references/20-principles__04-do-not-over-engineer.md`

### Code quality

- **Code Quality Improvement Process** — `references/20-code-quality__01-code-quality-improvement.md`

### Patterns

- **Store Management Pattern** — `references/30-patterns__01-store-management.md`
- **State Machine Pattern** — `references/30-patterns__02-state-machine.md`
- **Strategy Pattern** — `references/30-patterns__03-strategy.md`
- **Composition Pattern** — `references/30-patterns__04-composition.md`

### Guidelines

- **Keep It Simple** — `references/40-guidelines__01-keep-it-simple.md`
- **Keep URLs Flat** — `references/40-guidelines__02-keep-urls-flat.md`

### UI guidelines

- **Data Structure Visualization** — `references/60-ui__01-data-structure-visualization.md`
- **Research UI Library and Patterns** — `references/60-ui__02-research-ui-library.md`


## Quick conventions (always apply)

- Use `navigateTo` from `#app` instead of `router.push`
- Import Nuxt composables explicitly from `#app`
- Access route params with bracket notation: `route.params["id"]`
- Use `v-for="x of items"` (not `in`)
- Internal links: relative paths (`/kontakt`, `/rechner`)
- API identifiers in body/query params, not URL path segments
- Research existing `components/sections/` before creating new ones
- Keep solutions simple (KISS, YAGNI)
