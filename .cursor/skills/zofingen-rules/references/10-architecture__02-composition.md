# Component Composition

## Purpose
Maintain code readability and manageability by breaking down large components into smaller, focused sub-components while following clear organization principles.

## When to Apply
- When a file exceeds 100 lines of code
- When a component has multiple distinct sections
- When similar code patterns emerge
- When logic becomes too complex
- When testing becomes difficult

## When Not to Apply
- For very simple components
- When splitting would add unnecessary complexity
- When components are still evolving
- When the separation boundaries aren't clear

## Guidelines

### File Size Limits
1. **Ideal**: 60-100 lines
   - Clear single responsibility
   - Easy to understand and test
   - Maintainable and readable

2. **Acceptable**: 100-150 lines
   - Requires justification
   - Should be considered for splitting
   - May be temporary during development

3. **Exceptional**: >150 lines
   - Requires explicit approval
   - Must have clear reason for size
   - Should be rare and documented

### Component Organization

1. **Naming Conventions**
   - Use underscore prefix for local components (`_ProfileWidget.vue`)
   - Use PascalCase for component names
   - Name should reflect component's purpose

2. **File Structure**
   - Group related components together
   - Use relative imports for local components
   - Keep shared components separate

3. **Component Hierarchy**
   - Parent components should be coordinators
   - Child components should be focused
   - Minimize prop drilling

## Examples

### Bad: Monolithic Component
```vue
<!-- BAD: Everything in one file -->
<template>
  <div class="dashboard">
    <header>
      <!-- Complex header logic -->
      <div class="user-info">
        <!-- User profile details -->
      </div>
      <div class="notifications">
        <!-- Notification system -->
      </div>
    </header>
    
    <main>
      <section class="analytics">
        <!-- Complex analytics -->
      </section>
      
      <section class="recent-activity">
        <!-- Activity feed -->
      </section>
      
      <section class="settings">
        <!-- User settings -->
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// Hundreds of lines of logic...
</script>
```

### Good: Composed Components
```vue
<!-- Dashboard.vue -->
<script setup lang="ts">
import DashboardHeader from './_DashboardHeader.vue'
import AnalyticsPanel from './_AnalyticsPanel.vue'
import ActivityFeed from './_ActivityFeed.vue'
import UserSettings from './_UserSettings.vue'
</script>

<template>
  <div class="dashboard">
    <DashboardHeader />
    <main>
      <AnalyticsPanel />
      <ActivityFeed />
      <UserSettings />
    </main>
  </div>
</template>
```

```vue
<!-- _DashboardHeader.vue -->
<script setup lang="ts">
import UserProfile from './_UserProfile.vue'
import NotificationCenter from './_NotificationCenter.vue'
</script>

<template>
  <header>
    <UserProfile />
    <NotificationCenter />
  </header>
</template>
```

### Good: Gradual Composition
```vue
<!-- Start simple -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.bio }}</p>
  </div>
</template>

<!-- Extract when complexity grows -->
<template>
  <div class="user-card">
    <UserHeader :user="user" />
    <UserBio :bio="user.bio" />
  </div>
</template>
```

## Common Pitfalls
- Premature component extraction
- Over-componentization
- Poor component boundaries
- Prop drilling
- Tight coupling between components
- Inconsistent naming conventions

## Migration Guide
1. Identify large components
2. Map component responsibilities
3. Identify natural break points
4. Create sub-components
5. Extract shared logic
6. Update imports and props
7. Test each component

## Validation
- Component has single responsibility
- File size within limits
- Clear component boundaries
- Minimal prop dtenanization
- Components are testable

## Related Concepts
- Single Responsibility Principle
- Separation of Concerns
- Component-Based Architecture
- Smart/Dumb Components Pattern

## External Resources
- [Vue Style Guide](../https:/vuejs.org/style-guide)
- [Component Design Patterns](../https:/vuejs.org/guide/components/registration.html)

Tags: #architecture #components #vue #composition #organization
