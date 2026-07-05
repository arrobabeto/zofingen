# Cursor Rules V2

## Overview
This is the V2 version of our Cursor rules, organized for better discoverability and machine readability.

## Categories

### 00-meta
Rules about rules - how to write, organize, and maintain our rule system.
- [Naming Conventions](./00-meta/00-naming.md)
- [Rule Structure](./00-meta/01-structure.md)
- [General Principles](./00-meta/01-general-principles.md)

### 10-architecture
High-level architecture decisions and patterns.
- [Base Stack and Dependencies](./10-architecture/01-base-stack.md)
- [Component Composition](./10-architecture/02-composition.md)
- [Orbitype Headless CMS](./10-architecture/03-orbitype-cms.md)

### 20-principles
Core development principles and philosophies.
- [Do Not Lie](./20-principles/01-do-not-lie.md)
- [Prefer Vanilla](./20-principles/02-prefer-vanilla.md)
- [Prefer OOP](./20-principles/03-prefer-oop.md)
- [Do Not Over-Engineer](./20-principles/04-do-not-over-engineer.md)

### 20-code-quality
Code quality standards and best practices.
- [Code Quality Improvement](./20-code-quality/01-code-quality-improvement.md)

### 30-patterns
Design patterns and their implementation.
- [Store Management](./30-patterns/01-store-management.md)
- [State Machine](./30-patterns/02-state-machine.md)
- [Strategy Pattern](./30-patterns/03-strategy.md)
- [Composition Pattern](./30-patterns/04-composition.md)

### 40-guidelines
General principles and practices.
- [Keep It Simple](./40-guidelines/01-keep-it-simple.md)
- [Keep URLs Flat](./40-guidelines/02-keep-urls-flat.md)

### 50-database
Database-related rules and best practices.
- [Database Interaction](./50-database/01-database-interaction.md)

### 60-ui
UI development guidelines and patterns.
- [Data Structure Visualization](./60-ui/01-data-structure-visualization.md)
- [Research UI Library](./60-ui/02-research-ui-library.md)

## Core Principles

### Architecture
- Object-oriented core (classes, services, interfaces, ...)
- Functional utilities (pure functions, composition, ...)
- Simplicity (KISS, YAGNI, ...)
- Validity (type safety, linting, ...)
- Modularity (separation of concerns, abstractions, ...)
- Orbitype CMS: Figma → Figma MCP → Cursor sections → Orbitype MCP `sections` JSON ([Orbitype Headless CMS](./10-architecture/03-orbitype-cms.md))
- Prefer Vue-onic code style
- Prefer Tailwind-onic code style
- Keep prototype features and extend them
- Avoid global state (if necessary, use service/Store.ts)


## Navigation
- Use `navigateTo` from `#app` instead of `router.push` for page navigation
- Example: `await navigateTo('/path')` instead of `router.push('/path')`
- Rationale: Provides better integration with Nuxt's navigation system and middleware

## Imports
- Import Nuxt composables explicitly from `#app` instead of auto-imports
- Example: `import { useRoute, navigateTo } from "#app"` instead of using them directly
- Rationale: Improves code clarity, TypeScript support, and IDE functionality

## TypeScript
- Access route params using bracket notation to prevent type errors
- Example: `route.params["id"]` instead of `route.params.id`
- Rationale: Ensures proper TypeScript type narrowing for route parameters

## Error Handling
- Don't handle 404 cases in components when they're handled globally
- Example: `const item = ref({} as Item)` instead of `const item = ref<Item | undefined>()`
- Rationale: Reduces unnecessary null checks when 404s are handled at the router level

## API Conventions
- Pass identifiers in body/query params instead of URL path
- Example: `get("/items", { id })` instead of `get("/items/${id}")`
- Rationale: Consistent parameter handling and better type safety

## Vue Templates
- Use `of` instead of `in` for v-for directives
- Example: `v-for="i of items"` instead of `v-for="item in items"`
- Use short variable names in v-for loops
- Example: `v-for="w of workflows"` instead of `v-for="workflow in workflows"`
- Rationale: Consistent and concise iteration syntax across templates 




## Quick Links

### Most Referenced Rules
1. [Orbitype Headless CMS](./10-architecture/03-orbitype-cms.md)
2. [Code Quality Improvement](./20-code-quality/01-code-quality-improvement.md)
3. [Store Management](./30-patterns/01-store-management.md)
4. [Do Not Over-Engineer](./20-principles/04-do-not-over-engineer.md)

### Recently Updated
1. [Orbitype Headless CMS](./10-architecture/03-orbitype-cms.md)
2. [Research UI Library](./60-ui/02-research-ui-library.md)

## Using These Rules

### For Developers
1. Start with the meta rules to understand the structure
2. Review architecture rules before making major decisions
3. Reference code quality rules during implementation
4. Consult pattern rules when designing solutions

### For Code Review
1. Use as checklist during reviews
2. Reference specific rules in comments
3. Ensure compliance with mandatory rules

### For Cursor LLM
The rules include machine-readable metadata to help Cursor LLM:
- Provide relevant suggestions
- Enforce coding standards
- Guide refactoring decisions

## Contributing
To add or modify rules:
1. Follow the [Rule Structure](./00-meta/01-structure.md)
2. Use the [Naming Conventions](./00-meta/00-naming.md)
3. Include all required sections
4. Add appropriate metadata
5. Update this index

Tags: #index #documentation #overview #navigation
