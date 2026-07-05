# Keep URLs Flat

## Purpose
Maintain flexible and scalable URL structures by favoring flat URLs with query parameters over deeply nested hierarchical routes, enabling more versatile filtering and better maintainability.

## When to Apply
- When designing API endpoints
- When creating route structures
- When implementing filters
- When handling resource relationships
- When building search functionality
- When managing complex data hierarchies

## When Not to Apply
- When hierarchy is fundamental to the resource
- When URL needs to reflect ownership
- When following external API requirements
- When matching legacy system patterns
- When team convention dictates otherwise

## Guidelines

### URL Structure
1. **Keep it Flat**
   - Use root-level resources
   - Avoid deep nesting
   - Prefer query parameters
   - Keep URLs short

2. **Resource Naming**
   - Use plural nouns
   - Be consistent
   - Be descriptive
   - Follow REST conventions

3. **Query Parameters**
   - Use for filtering
   - Use for sorting
   - Use for pagination
   - Use for relationships

## Examples

### Good: Flat URLs with Query Parameters
```typescript
// GOOD: Flat URL structure
const API = {
  // List tasks with various filters
  getTasks: (filters: TaskFilters) => 
    `/tasks?${new URLSearchParams({
      projectId: filters.projectId,
      userId: filters.userId,
      priority: filters.priority,
      status: filters.status,
    })}`,

  // Get single task
  getTask: (id: string) => 
    `/tasks/${id}`,

  // Create task
  createTask: () => 
    '/tasks',
}

// Usage examples
fetch(API.getTasks({ projectId: '1', priority: 'high' }))
fetch(API.getTasks({ userId: '2', status: 'pending' }))
fetch(API.getTasks({ projectId: '1', userId: '2' }))
```

### Bad: Deeply Nested URLs
```typescript
// BAD: Rigid hierarchical structure
const API = {
  // Deeply nested, inflexible routes
  getProjectTasks: (projectId: string) =>
    `/projects/${projectId}/tasks`,
    
  getUserProjectTasks: (userId: string, projectId: string) =>
    `/users/${userId}/projects/${projectId}/tasks`,
    
  getTeamUserProjectTasks: (teamId: string, userId: string, projectId: string) =>
    `/teams/${teamId}/users/${userId}/projects/${projectId}/tasks`
}

// Usage becomes complex and inflexible
fetch(API.getTeamUserProjectTasks('team1', 'user1', 'project1'))
```

### Good: Resource Relationships
```typescript
// GOOD: Flat URLs with relationship parameters
interface ResourceFilters {
  includeRelated?: string[]
  sort?: string
  page?: number
  limit?: number
}

class ApiClient {
  // Generic method for fetching resources with relationships
  async getResources<T>(
    resource: string,
    filters: ResourceFilters
  ): Promise<T[]> {
    const params = new URLSearchParams({
      include: filters.includeRelated?.join(',') || '',
      sort: filters.sort || '',
      page: String(filters.page || 1),
      limit: String(filters.limit || 20)
    })
    
    return fetch(`/api/${resource}?${params}`)
      .then(res => res.json())
  }
}

// Usage
const api = new ApiClient()
api.getResources('tasks', {
  includeRelated: ['project', 'assignee'],
  sort: '-createdAt',
  page: 1,
  limit: 10
})
```

## Common Pitfalls
- Over-nesting resources
- Inconsistent URL patterns
- Missing query parameters
- Rigid hierarchies
- Poor scalability
- Redundant endpoints
- Inflexible filtering

## Migration Guide
1. Identify nested routes
2. Map resource relationships
3. Design query parameters
4. Create flat endpoints
5. Update API clients
6. Update documentation
7. Deprecate old routes

## Validation
Ask these questions:
- Is the URL structure flat?
- Are relationships flexible?
- Can filters be combined?
- Is pagination supported?
- Is sorting flexible?
- Are patterns consistent?

## Related Concepts
- REST API Design
- Query Parameters
- Resource Relationships
- API Versioning
- URL Structure
- HTTP Methods

## External Resources
- [REST API Best Practices](../https:/www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
- [API Design Guide](../https:/google.aip.dev/121)
- [URL Design Guidelines](../https:/www.w3.org/Provider/Style/URI)

Tags: #api-design #rest #urls #best-practices #architecture
