// Syncs agent documentation between Cursor and Claude Code.
// Usage: node _scripts/sync-agent-docs.mjs
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  cpSync,
  rmSync,
  existsSync,
} from "node:fs"
import { join, relative, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const rulesSrc = join(root, ".cursor/rules")
const rulesOut = join(root, "agent/rules")
const skillsSrc = join(root, "agent/skills")
const cursorSkills = join(root, ".cursor/skills")
const claudeSkills = join(root, ".claude/skills")
const mcpTemplate = join(root, "agent/mcp.template.json")

/** @param {string} dir */
function walkMdcFiles(dir, base = dir) {
  /** @type {string[]} */
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...walkMdcFiles(full, base))
    } else if (entry.endsWith(".mdc")) {
      files.push(relative(base, full))
    }
  }
  return files.sort()
}

/** @param {string} content */
function stripFrontmatter(content) {
  const lines = content.split("\n")
  if (lines[0]?.trim() !== "---") return content

  let end = -1
  let count = 0
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === "---") {
      count++
      if (count === 1) {
        end = i
        break
      }
    }
  }

  if (end === -1) return content

  let body = lines.slice(end + 1).join("\n").trimStart()

  // Fix double frontmatter in some rules (e.g. 60-ui/02-research-ui-library.mdc)
  if (body.startsWith("---")) {
    body = stripFrontmatter(body)
  }

  return body
}

/** @param {string} content @param {string} ruleRelPath e.g. 10-architecture/03-orbitype-cms.mdc */
function convertMdcLinks(content, ruleRelPath) {
  const ruleDir = dirname(ruleRelPath)

  return content
    .replace(/\[([^\]]+)\]\(mdc:([^)]+)\)/g, (_match, label, path) => {
      const normalized = path.replace(/^\.\.\//, "")
      const target = join(rulesOut, normalized.replace(/\.mdc$/, ".md"))
      const from = join(rulesOut, ruleRelPath.replace(/\.mdc$/, ".md"))
      let rel = relative(dirname(from), target).replace(/\\/g, "/")
      if (!rel.startsWith(".")) rel = `./${rel}`
      return `[${label}](${rel})`
    })
    .replace(/\(mdc:([^)]+)\)/g, (_match, path) => {
      const normalized = path.replace(/^\.\.\//, "")
      return `(agent/rules/${normalized.replace(/\.mdc$/, ".md")})`
    })
}

/** @param {string} mdcPath relative to rulesSrc */
function convertRule(mdcPath) {
  const src = join(rulesSrc, mdcPath)
  const dest = join(rulesOut, mdcPath.replace(/\.mdc$/, ".md"))
  const raw = readFileSync(src, "utf8")
  const body = stripFrontmatter(raw)
  const converted = convertMdcLinks(body, mdcPath)

  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, `${converted.trim()}\n`, "utf8")
  return mdcPath.replace(/\.mdc$/, ".md")
}

/** @param {string[]} ruleFiles relative paths without .mdc */
function ruleTitle(mdPath) {
  const content = readFileSync(join(rulesOut, mdPath), "utf8")
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : mdPath
}

/** @param {string[]} convertedRules */
function generateZofingenRulesSkill(convertedRules) {
  const refsDir = join(skillsSrc, "zofingen-rules", "references")
  mkdirSync(refsDir, { recursive: true })

  // Copy converted rules into references/
  for (const rule of convertedRules) {
    const src = join(rulesOut, rule)
    const dest = join(refsDir, rule.replace(/\//g, "__"))
    writeFileSync(dest, readFileSync(src, "utf8"), "utf8")
  }

  const categories = {
    "00-meta": "Meta (rules about rules)",
    "10-architecture": "Architecture",
    "20-principles": "Principles",
    "20-code-quality": "Code quality",
    "30-patterns": "Patterns",
    "40-guidelines": "Guidelines",
    "60-ui": "UI guidelines",
  }

  /** @type {Record<string, { path: string, title: string }[]>} */
  const grouped = {}

  for (const rule of convertedRules) {
    const cat = rule.split("/")[0] ?? "other"
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({ path: rule, title: ruleTitle(rule) })
  }

  let index = ""
  for (const [cat, label] of Object.entries(categories)) {
    const items = grouped[cat]
    if (!items?.length) continue
    index += `\n### ${label}\n\n`
    for (const item of items) {
      const refName = item.path.replace(/\//g, "__")
      index += `- **${item.title}** — \`references/${refName}\`\n`
    }
  }

  const skillMd = `---
name: zofingen-rules
description: >-
  Zofingen Treuhand project coding standards, architecture, patterns, and UI
  guidelines. Use when unsure about conventions, reviewing code style, or
  looking up project rules synced from .cursor/rules/.
---

# Zofingen project rules

This skill indexes all project rules converted from \`.cursor/rules/\`.

## How to use

1. Identify the topic (architecture, patterns, UI, principles, etc.).
2. Read the matching file from \`references/\` in this skill directory.
3. Apply the guidelines to your current task.

Run \`npm run sync:agent\` after editing \`.cursor/rules/\` to refresh references.

## Rule index
${index}

## Quick conventions (always apply)

- Use \`navigateTo\` from \`#app\` instead of \`router.push\`
- Import Nuxt composables explicitly from \`#app\`
- Access route params with bracket notation: \`route.params["id"]\`
- Use \`v-for="x of items"\` (not \`in\`)
- Internal links: relative paths (\`/kontakt\`, \`/rechner\`)
- API identifiers in body/query params, not URL path segments
- Research existing \`components/sections/\` before creating new ones
- Keep solutions simple (KISS, YAGNI)
`

  writeFileSync(join(skillsSrc, "zofingen-rules", "SKILL.md"), skillMd, "utf8")
}

/** @param {string} src @param {string} dest */
function copySkillDir(src, dest) {
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
  cpSync(src, dest, { recursive: true })
}

/** Sync all skill directories from agent/skills to target */
function syncSkillsTo(targetDir) {
  mkdirSync(targetDir, { recursive: true })
  for (const name of readdirSync(skillsSrc)) {
    const src = join(skillsSrc, name)
    if (!statSync(src).isDirectory()) continue
    copySkillDir(src, join(targetDir, name))
  }
}

function syncMcp() {
  const template = readFileSync(mcpTemplate, "utf8")
  writeFileSync(join(root, ".mcp.json"), template, "utf8")
  mkdirSync(join(root, ".cursor"), { recursive: true })
  writeFileSync(join(root, ".cursor/mcp.json"), template, "utf8")
}

function main() {
  console.log("Converting .cursor/rules → agent/rules …")
  const mdcFiles = walkMdcFiles(rulesSrc)
  const converted = mdcFiles.map(convertRule)
  console.log(`  ${converted.length} rules converted`)

  console.log("Generating zofingen-rules skill …")
  generateZofingenRulesSkill(converted)

  console.log("Copying skills to .cursor/skills and .claude/skills …")
  syncSkillsTo(cursorSkills)
  syncSkillsTo(claudeSkills)
  const skillCount = readdirSync(skillsSrc).filter((n) =>
    statSync(join(skillsSrc, n)).isDirectory(),
  ).length
  console.log(`  ${skillCount} skills synced`)

  console.log("Writing MCP configs …")
  syncMcp()

  console.log("Done. Run from Cursor or Claude Code with synced skills.")
}

main()
