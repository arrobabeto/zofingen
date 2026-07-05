# Store Management Pattern

## Purpose
Define a consistent approach to state management that favors simplicity and maintainability while avoiding unnecessary complexity and tight coupling.

## When to Apply
- When state needs to be shared across many components
- For application-wide state (e.g., user settings, theme)
- When state needs to persist across route changes
- When state mutations need to be centralized and controlled

## When Not to Apply
- For component-local state (use `ref()` or `reactive()`)
- For parent-child component communication (use props)
- When URL parameters or localStorage would suffice
- When state is only needed in a small component subtree

## Guidelines

### State Management Hierarchy
Follow this hierarchy of state management solutions, from simplest to most complex:

1. **Local Component State**
   - Use `ref()` or `reactive()`
   - Simplest form of state
   - Scoped to single component

2. **Props and Events**
   - Parent-child communication
   - Clear data flow
   - Component composition

3. **Browser State**
   - URL parameters
   - localStorage/sessionStorage
   - indexedDB

4. **Global Store**
   - Last resort
   - Only for truly global state
   - Keep minimal

### Store Implementation

```typescript
// services/Store.ts
import { reactive } from "vue"

interface State {
  readonly value: number
  readonly items: string[]
}

interface Actions {
  increment(): void
  addItem(item: string): void
}

class _Store implements State, Actions {
  private _value = 0
  private _items: string[] = []

  get value() { return this._value }
  get items() { return [...this._items] }

  increment() {
    this._value++
  }

  addItem(item: string) {
    this._items.push(item)
  }
}

export const Store = reactive(new _Store()) as Readonly<_Store>
```

### Store Usage

```vue
<!-- Component.vue -->
<script setup lang="ts">
import { Store } from "~/services/Store"

function handleClick() {
  Store.increment()
  Store.addItem("new item")
}
</script>

<template>
  <div>
    <p>Value: {{ Store.value }}</p>
    <ul>
      <li v-for="item in Store.items" :key="item">
        {{ item }}
      </li>
    </ul>
    <button @click="handleClick">Update Store</button>
  </div>
</template>
```

## Examples

### Good: Local Component State
```vue
<script setup lang="ts">
import { ref } from "vue"

const isOpen = ref(false)
const toggleMenu = () => isOpen.value = !isOpen.value
</script>
```

### Good: Parent-Child State
```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { reactive } from "vue"

const form = reactive({
  name: "",
  email: ""
})
</script>

<template>
  <FormStep1 v-model:form="form" />
  <FormStep2 v-model:form="form" />
</template>
```

### Good: Global Store
```typescript
// UserStore.ts
class _UserStore {
  private _preferences = {
    theme: "light",
    fontSize: "medium"
  }

  get preferences() {
    return { ...this._preferences }
  }

  updateTheme(theme: "light" | "dark") {
    this._preferences.theme = theme
  }
}

export const UserStore = reactive(new _UserStore()) as Readonly<_UserStore>
```

### Bad: Overusing Global State
```typescript
// BAD: This should be local component state
class _UIStore {
  isMenuOpen = false
  activeTab = 0
  scrollPosition = 0
}
```

## Common Pitfalls
- Creating stores for non-global state
- Mutating store state directly instead of through methods
- Not typing store interfaces
- Storing derived state that could be computed
- Creating too many stores
- Not considering simpler alternatives

## Migration Guide
1. Audit existing state management
2. Identify state that can be localized
3. Create proper interfaces and types
4. Implement store with proper encapsulation
5. Add computed properties for derived state
6. Update components to use new store

## Validation
- State is properly encapsulated
- Mutations only happen through methods
- Store is properly typed
- No direct state mutations
- Clear separation of concerns
- Minimal global state

## Related Patterns
- Observer Pattern
- Singleton Pattern
- Command Pattern
- Proxy Pattern

## External Resources
- [(htas/composition-api-faq.html)
- [State Management Patterns](../https:/vuejs.org/guide/scaling-up/state-management.html)

Tags: #pattern #state-management #vue #typescript #reactive
