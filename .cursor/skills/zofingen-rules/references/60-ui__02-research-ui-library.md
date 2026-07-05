# Research UI Library and Patterns

## Purpose
Ensure efficient development and maintain consistency by thoroughly researching and utilizing existing components, patterns, and solutions before implementing new ones, promoting code reuse and reducing duplication.

## When to Apply
- Before creating new components
- When implementing new features
- When solving UI challenges
- When extending functionality
- When refactoring components
- When planning architecture

## When Not to Apply
- When prototyping experimental features
- When existing solutions are proven inadequate
- When performance requirements differ significantly
- When accessibility needs are unique
- When creating foundational components

## Guidelines

### Research Process
1. **Component Discovery**
   - Search component library
   - Review similar features
   - Check documentation
   - Examine implementations

2. **Pattern Analysis**
   - Identify common patterns
   - Study usage examples
   - Review composables
   - Understand services

3. **Solution Evaluation**
   - Test component flexibility
   - Verify performance
   - Check accessibility
   - Consider maintainability

## Examples

### Good: Component Discovery
```typescript
// GOOD: Researching and using existing components
import { DataTable, Pagination, SearchInput } from '@/components/ui'
import { useSort, useFilter } from '@/composables'
import { formatData } from '@/utils'

// Reusing existing table with built-in features
const UserList = defineComponent({
  setup() {
    const { sort, sortedData } = useSort(users)
    const { filter, filteredData } = useFilter(sortedData)

    return () => (
      <DataTable
        data={filteredData.value}
        onSort={sort}
      >
        <SearchInput onSearch={filter} />
        <Pagination />
      </DataTable>
    )
  }
})

// BAD: Creating new components without research
const CustomTable = defineComponent({
  setup() {
    // Reinventing sorting
    const sortData = (data: any[]) => {
      // Custom sort implementation
    }

    // Reinventing filtering
    const filterData = (data: any[]) => {
      // Custom filter implementation
    }

    return () => (
      <table>
        {/* Custom table implementation */}
      </table>
    )
  }
})
```

### Good: Pattern Adaptation
```vue
<!-- GOOD: Adapting existing patterns -->
<template>
  <BaseLayout>
    <template #header>
      <PageHeader
        title="User Management"
        :actions="headerActions"
      />
    </template>

    <template #sidebar>
      <NavigationMenu
        :items="menuItems"
        :active="currentRoute"
      />
    </template>

    <template #main>
      <ContentPanel>
        <slot />
      </ContentPanel>
    </template>
  </BaseLayout>
</template>

<!-- BAD: Creating unique layout without considering patterns -->
<template>
  <div class="custom-layout">
    <header class="custom-header">
      <!-- Custom header implementation -->
    </header>

    <nav class="custom-nav">
      <!-- Custom navigation implementation -->
    </nav>

    <main class="custom-main">
      <!-- Custom content area -->
    </main>
  </div>
</template>
```

### Good: Service Integration
```typescript
// GOOD: Using existing services and patterns
import { UserService } from '@/services'
import { useNotification } from '@/composables'
import { handleError } from '@/utils'

const UserManagement = defineComponent({
  setup() {
    const notification = useNotification()

    const handleUserUpdate = async (user: User) => {
      try {
        await UserService.update(user)
        notification.success('User updated successfully')
      } catch (error) {
        handleError(error)
      }
    }

    return { handleUserUpdate }
  }
})

// BAD: Implementing custom service logic
const CustomUserManager = defineComponent({
  setup() {
    const updateUser = async (user: User) => {
      try {
        await fetch('/api/users', {
          method: 'PUT',
          body: JSON.stringify(user)
        })
        // Custom notification
        alert('Success')
      } catch (error) {
        // Custom error handling
        console.error(error)
      }
    }

    return { updateUser }
  }
})
```

## Common Pitfalls
- Insufficient research
- Premature component creation
- Duplicating functionality
- Ignoring existing patterns
- Inconsistent implementations
- Poor documentation review
- Missed optimization opportunities

## Migration Guide
1. Audit component usage
2. Document existing patterns
3. Identify duplicates
4. Plan standardization
5. Create usage guidelines
6. Update documentation
7. Train team members

## Validation
Ask these questions:
- Have we thoroughly searched existing solutions?
- Are we following established patterns?
- Can existing components be adapted?
- Is the new implementation necessary?
- Have we checked documentation?
- Is this a common pattern?

## Related Concepts
- Component Libraries
- Design Systems
- Code Reusability
- Pattern Libraries
- Composition Patterns
- Service Architecture

## External Resources
- [Vue Component Guidelines](../https:/vuejs.org/guide/components/registration.html)
- [Design System Handbook](../https:/www.designbetter.co/design-systems-handbook)
- [Component-Driven Development](../https:/www.componentdriven.org)

Tags: #components #patterns #reusability #research #best-practices
