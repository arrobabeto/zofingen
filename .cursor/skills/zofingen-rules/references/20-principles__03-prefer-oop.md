# Prefer Object-Oriented Programming

## Purpose
Promote code organization, maintainability, and reusability through object-oriented programming principles, favoring classes and composition over functional approaches when appropriate.

## When to Apply
- When designing services and utilities
- When managing complex state
- When implementing business logic
- When creating reusable components
- When defining data structures
- When building system architecture

## When Not to Apply
- For simple utility functions
- For stateless transformations
- For pure data mapping
- For one-off scripts
- When functional approach is clearer

## Guidelines

### Class Design
1. **Structure**
   - Clear responsibility
   - Proper encapsulation
   - Meaningful methods
   - Type-safe properties

2. **Composition**
   - Prefer composition over inheritance
   - Use interfaces for contracts
   - Keep dependencies explicit
   - Follow SOLID principles

3. **State Management**
   - Encapsulate internal state
   - Provide clear access methods
   - Use private fields appropriately
   - Consider immutability

## Examples

### Good: Class-based Service
```typescript
// GOOD: Clear OOP structure
class UserService {
  private apiClient: ApiClient
  private cache: Map<string, User>

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
    this.cache = new Map()
  }

  async getUser(id: string): Promise<User> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!
    }
    
    const user = await this.apiClient.get(`/users/${id}`)
    this.cache.set(id, user)
    return user
  }

  private clearCache(): void {
    this.cache.clear()
  }
}

// BAD: Functional style without clear benefits
function makeUserService(apiClient: ApiClient) {
  const cache = new Map()
  
  return {
    getUser: async (id: string) => {
      if (cache.has(id)) return cache.get(id)
      const user = await apiClient.get(`/users/${id}`)
      cache.set(id, user)
      return user
    },
    _clearCache: () => cache.clear()
  }
}
```

### Good: Component State Management
```typescript
// GOOD: Class-based state management
class FormState {
  private _values: Record<string, unknown> = {}
  private _errors: Record<string, string[]> = {}
  
  setValue(field: string, value: unknown): void {
    this._values[field] = value
    this.validate(field)
  }

  getError(field: string): string[] {
    return this._errors[field] || []
  }

  private validate(field: string): void {
    // Validation logic
  }
}

// BAD: Object literal with implicit structure
const formState = {
  values: {},
  errors: {},
  setValue(field, value) {
    this.values[field] = value
    // Validation scattered or missing
  }
}
```

### Good: Data Structures
```typescript
// GOOD: Class with proper encapsulation
class Queue<T> {
  private items: T[] = []

  enqueue(item: T): void {
    this.items.push(item)
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  get size(): number {
    return this.items.length
  }
}

// BAD: Direct array manipulation
const queue = []
queue.push(item) // No encapsulation or type safety
queue.shift()
```

## Common Pitfalls
- Overusing inheritance
- Mixing OOP and functional styles
- Poor encapsulation
- Complex class hierarchies
- Tight coupling
- Missing interfaces
- Improper state management

## Migration Guide
1. Identify functional code
2. Extract class responsibilities
3. Define interfaces
4. Implement classes
5. Add proper typing
6. Refactor consumers
7. Add tests

## Validation
Ask these questions:
- Does the class have a single responsibility?
- Is state properly encapsulated?
- Are dependencies explicit?
- Is composition used appropriately?
- Are interfaces well-defined?
- Is the code testable?

## Related Concepts
- SOLID Principles
- Design Patterns
- Dependency Injection
- Interface Segregation
- Composition vs Inheritance

## External Resources
- [TypeScript Classes](../https:/www.typescriptlang.org/docs/handbook/classes.html)
- [SOLID Principles](../https:/en.wikipedia.org/wiki/SOLID)
- [Design Patterns](../https:/refactoring.guru/design-patterns)

Tags: #oop #classes #typescript #design-patterns #best-practices
