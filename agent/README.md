# Agent documentation (Cursor + Claude Code)

This folder is the **canonical source** for project skills and MCP templates shared between Cursor and Claude Code.

## Layout

```
agent/
├── README.md                 # This file
├── mcp.template.json         # MCP config template (Orbitype, Figma)
├── rules/                    # Generated from .cursor/rules/ (do not edit manually)
└── skills/
    ├── orbitype-cms/         # CMS workflow
    ├── build-figma-page/     # Figma → page workflow
    ├── seed-pages/           # Seed script patterns
    └── zofingen-rules/       # Index of all project rules (generated references/)
```

## Where things live per IDE

| Artifact | Cursor | Claude Code |
|----------|--------|-------------|
| Always-on rules | `.cursor/rules/*.mdc` | `CLAUDE.md` (root) |
| Skills | `.cursor/skills/` | `.claude/skills/` |
| MCP config | `.cursor/mcp.json` | `.mcp.json` (root) |

Both IDEs receive the **same skill content** after sync. Cursor rules (`.mdc`) remain the source for general conventions; Claude loads them via the `zofingen-rules` skill references.

## Sync workflow

After editing `.cursor/rules/` or `agent/skills/`:

```bash
npm run sync:agent
```

This script:

1. Converts `.cursor/rules/**/*.mdc` → `agent/rules/**/*.md`
2. Generates `zofingen-rules` references and SKILL.md index
3. Copies `agent/skills/*` → `.cursor/skills/` and `.claude/skills/`
4. Writes `.mcp.json` and `.cursor/mcp.json` from `agent/mcp.template.json`

**Do not edit** `.cursor/skills/`, `.claude/skills/`, or `agent/rules/` directly — they are overwritten on sync.

## What to edit

| Change | Edit | Then run |
|--------|------|----------|
| General principles, patterns, UI rules | `.cursor/rules/` | `npm run sync:agent` |
| Orbitype / Figma / seed workflows | `agent/skills/<skill>/SKILL.md` | `npm run sync:agent` |
| MCP server definitions | `agent/mcp.template.json` | `npm run sync:agent` |
| Always-on Claude context | `CLAUDE.md` (root) | — |

## Environment variables

Copy `.env.example` to `.env` and set:

- `ORBITYPE_API_SQL_URL`, `ORBITYPE_API_SQL_KEY` — seed scripts and API
- `FIGMA_API_KEY`, `FIGMA_FILE_KEY` — Figma REST / MCP
- Optional Orbitype MCP keys referenced in `agent/mcp.template.json`

## Skills quick reference

| Skill | Invoke | Use when |
|-------|--------|----------|
| `orbitype-cms` | `/orbitype-cms` | Sections, CMS JSON, Orbitype MCP |
| `build-figma-page` | `/build-figma-page` | New page from Figma design |
| `seed-pages` | `/seed-pages` | Create or update `_scripts/_seed-*.mjs` |
| `zofingen-rules` | `/zofingen-rules` | Look up any project rule by topic |
