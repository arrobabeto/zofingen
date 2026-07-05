# Prefer Vanilla

## Purpose
Minimize project complexity and external dependencies by leveraging native JavaScript/TypeScript features and browser APIs when feasible, reducing potential bugs, lock-in, and maintenance overhead.

## When to Apply
- When considering adding a new dependency
- When implementing common functionality
- When working with browser APIs
- When managing application state
- When handling data structures
- When implementing utilities

## When Not to Apply
- For complex, battle-tested libraries (Vue, React)
- For security-critical features
- When reinventing would be costly
- When standards compliance is crucial
- When team expertise favors a library

## Guidelines

### Evaluating Dependencies
1. **Ask These Questions**
   - Is this solving a complex problem?
   - Is the native alternative mature?
   - What's the maintenance cost?
   - Is lock-in acceptable?

2. **Consider Alternatives**
   - Browser APIs
   - Native JavaScript features
   - Simple custom solutions
   - Smaller, focused packages

3. **Weigh Trade-offs**
   - Bundle size impact
   - Learning curve
   - Long-term maintenance
   - Community support

## Examples

### Good: Native Configuration
```typescript
// BAD: Using external config management
import { defineAppConfig } from 'nuxt/config'

export default defineAppConfig({
  hoursPerWeek: 45,
  numberOfVacationDays: 25,
})

const config = useAppConfig()
console.log(config.hoursPerWeek)

// GOOD: Simple vanilla object
export const CONFIG = {
  hoursPerWeek: 45,
  numberOfVacationDays: 25,
} as const

console.log(CONFIG.hoursPerWeek)
```

### Good: Native State Management
```typescript
// BAD: Using external state management
import { createStore } from 'vuex'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// GOOD: Simple reactive state
import { reactive } from 'vue'

class Counter {
  count = 0
  
  increment() {
    this.count++
  }
}

export const counter = reactive(new Counter())
```

### Good: Native APIs
```typescript
// BAD: Using axios for simple requests
import axios from 'axios'

async function fetchUser(id: string) {
  const response = await axios.get(`/api/users/${id}`)
  return response.data
}

// GOOD: Using fetch API
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

### Good: Native Storage
```typescript
// BAD: Using external storage library
import store from 'store2'

store.set('user', { name: 'John' })
const user = store.get('user')

// GOOD: Using localStorage
const storage = {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
}

storage.set('user', { name: 'John' })
const user = storage.get('user')
```

## Common Pitfalls
- Adding dependencies without evaluation
- Overlooking native solutions
- Overestimating library benefits
- Underestimating maintenance cost
- Creating unnecessary abstractions
- Ignoring bundle size impact

## Migration Guide
1. Audit current dependencies
2. Identify unnecessary packages
3. Research native alternatives
4. Create migration plan
5. Update documentation
6. Refactor gradually
7. Validate improvements

## Validation
Ask these questions:
- Is this dependency necessary?
- Could we use native features?
- What's the cost/benefit ratio?
- Are we duplicating functionality?
- Is the implementation maintainable?
- Does it affect bundle size?

## Related Concepts
- Bundle Size Optimization
- Progressive Enhancement
- Browser Compatibility
- Web Standards
- Performance Optimization

## External Resources
- [MDN Web APIs](../https:/developer.mozilla.org/en-US/docs/Web/API)
- [You Might Not Need jQuery](../https:/youmightnotneedjquery.com)
- [You Might Not Need Lodash](../https:/youmightnotneed.com/lodash)

Tags: #vanilla-js #dependencies #best-practices #optimization #web-standards
