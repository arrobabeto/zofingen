# Data Structure Visualization

## Purpose
Maximize code reuse and maintain consistency by leveraging existing UI components, patterns, and services from the codebase, avoiding unnecessary duplication and ensuring a cohesive user experience.

## When to Apply
- When creating new UI components
- When displaying data structures
- When implementing visualizations
- When building forms
- When adding new features
- When modifying existing components

## When Not to Apply
- When existing components truly don't fit
- When creating unique, one-off features
- When prototyping new patterns
- When performance requires custom solution
- When accessibility needs differ

## Guidelines

### Component Research
1. **Explore Existing Solutions**
   - Search component library
   - Review similar features
   - Check composables
   - Examine services

2. **Evaluate Fit**
   - Check component props
   - Review customization options
   - Test edge cases
   - Consider performance

3. **Local Adaptations**
   - Extend existing components
   - Use composition
   - Add wrapper components
   - Keep changes minimal

## Examples

### Good: Component Reuse
```vue
<!-- GOOD: Using existing components -->
<template>
  <DataTable
    :data="users"
    :columns="columns"
    :sortable="true"
    :filterable="true"
    @row-click="handleRowClick"
  >
    <template #cell-status="{ value }">
      <StatusBadge :status="value" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { DataTable, StatusBadge } from '@/components/ui'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
]
</script>

<!-- BAD: Reinventing existing components -->
<template>
  <table>
    <thead>
      <tr>
        <th @click="sort('name')">Name</th>
        <th @click="sort('email')">Email</th>
        <th @click="sort('status')">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in sortedUsers" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
          <div class="status-badge">{{ user.status }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

### Good: Form Components
```vue
<!-- GOOD: Using form library components -->
<template>
  <Form
    :validation-schema="schema"
    @submit="handleSubmit"
  >
    <FormField name="email">
      <FormInput
        type="email"
        placeholder="Enter email"
        :rules="emailRules"
      />
    </FormField>
    
    <FormField name="type">
      <FormSelect
        :options="userTypes"
        placeholder="Select type"
      />
    </FormField>
    
    <FormSubmitButton>
      Create User
    </FormSubmitButton>
  </Form>
</template>

<!-- BAD: Custom form implementation -->
<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <input
        v-model="email"
        type="email"
        @blur="validateEmail"
      >
      <span v-if="emailError">{{ emailError }}</span>
    </div>
    
    <div class="form-group">
      <select v-model="type">
        <option v-for="type in types" :key="type.value">
          {{ type.label }}
        </option>
      </select>
    </div>
    
    <button type="submit">Create User</button>
  </form>
</template>
```

### Good: Chart Components
```vue
<!-- GOOD: Using chart library -->
<template>
  <ChartContainer>
    <LineChart
      :data="timeSeriesData"
      :options="chartOptions"
      @point-click="handlePointClick"
    />
    <ChartLegend position="bottom" />
  </ChartContainer>
</template>

<!-- BAD: Custom chart implementation -->
<template>
  <div class="chart">
    <svg>
      <!-- Complex custom chart implementation -->
    </svg>
    <div class="legend">
      <!-- Custom legend implementation -->
    </div>
  </div>
</template>
```

## Common Pitfalls
- Reinventing existing components
- Missing reusable patterns
- Inconsistent styling
- Poor component composition
- Duplicate functionality
- Unnecessary customization
- Ignored library features

## Migration Guide
1. Audit existing components
2. Map component patterns
3. Identify reuse opportunities
4. Plan component adoption
5. Refactor gradually
6. Update documentation
7. Share knowledge

## Validation
Ask these questions:
- Have we searched for existing solutions?
- Can existing components be adapted?
- Is custom implementation necessary?
- Are we following patterns?
- Is the solution maintainable?
- Does it match design system?

## Related Concepts
- Component Libraries
- Design Systems
- Atomic Design
- Component Composition
- UI Patterns
- Reusability

## External Resources
- [Vue Component Best Practices](../https:/vuejs.org/guide/components/registration.html)
- [Atomic Design](../https:/bradfrost.com/blog/post/atomic-web-design)
- [Design System Guidelines](../https:/www.designsystems.com)

Tags: #ui #components #reusability #patterns #design-system
