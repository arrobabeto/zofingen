# General Principles

## Overview

These principles form the foundation of our development practices. They guide architectural decisions, code organization, and implementation details across all projects.

## Core Architecture

### 1. Object-Oriented Core

- **Classes**: Encapsulate related data and behavior
  ```typescript
  class UserService {
    private users: User[] = []
    
    async getUser(id: string): Promise<User> {
      return this.users.find(u => u.id === id)
    }
  }
  ```

- **Services**: Handle business logic and data operations
  ```typescript
  class AuthenticationService {
    constructor(private userService: UserService) {}
    
    async authenticate(credentials: Credentials): Promise<boolean> {
      // Implementation
    }
  }
  ```

- **Interfaces**: Define contracts and types
  ```typescript
  interface UserRepository {
    find(id: string): Promise<User>
    create(user: CreateUserDTO): Promise<User>
    update(id: string, data: UpdateUserDTO): Promise<User>
  }
  ```

### 2. Functional Utilities

- **Pure Functions**: Predictable, side-effect free operations
  ```typescript
  function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }
  ```

- **Composition**: Build complex behavior from simple functions
  ```typescript
  const processUser = pipe(
    validateUser,
    enrichUserData,
    saveUser
  )
  ```

### 3. Simplicity

- **KISS (Keep It Simple, Stupid)**
  - Favor straightforward solutions
  - Avoid premature optimization
  - Make code readable and maintainable

- **YAGNI (You Aren't Gonna Need It)**
  - Build only what's needed now
  - Avoid speculative features
  - Refactor when patterns emerge

### 4. Validity

- **Type Safety**
  ```typescript
  // GOOD: Strong typing
  interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
  }

  // BAD: Loose typing
  type User = any
  ```

- **Linting**
  - Enforce consistent code style
  - Catch common errors
  - Maintain code quality

### 5. Modularity

- **Separation of Concerns**
  - Each module has a single responsibility
  - Clear boundaries between components
  - Loose coupling between modules

- **Abstractions**
  - Hide implementation details
  - Provide clear interfaces
  - Enable easy testing

## Code Style Guidelines

### 1. Vue-onic Style

- Use Composition API
  ```vue
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  </script>
  ```

- Keep components focused
- Use TypeScript decorators when appropriate
- Follow Vue 3 best practices

### 2. Tailwind-onic Style

- Use utility classes
  ```html
  <div class="flex items-center justify-between p-4 bg-white shadow rounded">
    <!-- Content -->
  </div>
  ```

- Maintain consistent spacing
- Follow responsive design patterns
- Use design system tokens

## Best Practices

### 1. Avoid Duplication

- **DRY (Don't Repeat Yourself)**
  - Extract common functionality
  - Create reusable components
  - Share utilities across modules

### 2. State Management

- **Local State**: Prefer component-level state
  ```vue
  <script setup lang="ts">
  const isOpen = ref(false)
  </script>
  ```

- **Global State**: Use services for necessary global state
  ```typescript
  // services/Store.ts
  export class Store {
    private state = reactive({})
    // Implementation
  }
  ```

### 3. Feature Development

- Build on existing prototypes
- Extend functionality incrementally
- Maintain backward compatibility

## Anti-patterns to Avoid

### 1. Global State Pollution

```typescript
// BAD: Global variables
window.userData = { /* ... */ }

// GOOD: Encapsulated state
const userStore = new UserStore()
```

### 2. Code Duplication

```typescript
// BAD: Repeated logic
function formatUserName(user) {
  return `${user.firstName} ${user.lastName}`
}

function formatCustomerName(customer) {
  return `${customer.firstName} ${customer.lastName}`
}

// GOOD: Reusable function
function formatName(person: { firstName: string; lastName: string }) {
  return `${person.firstName} ${person.lastName}`
}
```

### 3. Tight Coupling

```typescript
// BAD: Direct dependencies
class UserComponent {
  private database = new Database()
  private logger = new Logger()
}

// GOOD: Dependency injection
class UserComponent {
  constructor(
    private database: Database,
    private logger: Logger
  ) {}
}
```

## Implementation Guide

1. **Start Simple**
   - Begin with basic implementation
   - Add complexity only when needed
   - Follow established patterns

2. **Maintain Quality**
   - Write tests
   - Document code
   - Review regularly

3. **Refactor Gradually**
   - Identify pain points
   - Plan improvements
   - Make incremental changes

## Summary

These principles guide our development process to create maintainable, scalable, and high-quality code. Remember to:

- Use object-oriented principles for core architecture
- Apply functional programming where appropriate
- Keep solutions simple and focused
- Ensure type safety and code quality
- Maintain modularity and separation of concerns
- Follow established code style guidelines
- Avoid global state and duplication
- Build on existing features systematically
