# Rule Structure and Format

## Purpose
Define a consistent structure for all rules to ensure clarity, completeness, and machine readability.

## Standard Rule Template
Every rule should follow this structure:

```markdown
---
priority: 1-5
applies_to: ["file patterns"]
triggers: ["relevant terms"]
related_rules: ["rule names"]
---

# Rule Title

## Purpose
Clear, concise statement of what this rule achieves and why it exists.

## When to Apply
- Specific scenarios when this rule should be used
- Trigger conditions
- Context where this rule is relevant

## When Not to Apply
- Exceptions to the rule
- Scenarios where other rules take precedence
- Cases where the rule might cause problems

## Guidelines
Specific implementation guidelines with:
- Clear steps
- Best practices
- Implementation details

## Examples

### Good Example
```typescript
// GOOD: Description of why this is good
function handleError(error: AppError) {
  logger.error(error)
  throw createCustomError(error)
}
```

### Bad Example
```typescript
// BAD: Description of why this is bad
function handleError(error: any) {
  console.log(error)
  throw error
}
```

## Common Pitfalls
- List of common mistakes
- How to avoid them
- What to do instead

## Related Rules
- [Rule One](../category/rule-one.md)
- [Rule Two](../category/rule-two.md)

## Migration Guide
Steps to migrate existing code to follow this rule:
1. Identify affected code
2. Make necessary changes
3. Validate changes

## Validation
How to verify the rule is being followed:
- Code review checklist
- Automated checks
- Testing approaches

Tags: #relevant #tags #here
```

## Required Sections
The following sections are mandatory:
- Purpose
- When to Apply
- Guidelines
- Examples

## Optional Sections
These sections should be included when relevant:
- When Not to Apply
- Common Pitfalls
- Migration Guide
- Validation

## Examples Format
Code examples should:
- Be concise but complete
- Include both good and bad examples
- Explain why each example is good or bad
- Use real-world scenarios
- Be syntax highlighted
- Include comments explaining key points

## Metadata Format
```yaml
---
priority: 1-5 (1 highest, 5 lowest)
applies_to: 
  - "*.ts"
  - "*.vue"
  - "*.js"
triggers:
  - "relevant terms"
  - "that should trigger"
  - "this rule"
related_rules:
  - "rule-one"
  - "rule-two"
---
```

## Writing Style
- Use active voice
- Be concise but clear
- Use consistent terminology
- Include rationale for guidelines
- Link to external resources when relevant

## Validation Checklist
- [ ] Has all required sections
- [ ] Includes metadata
- [ ] Contains practical examples
- [ ] Uses correct formatting
- [ ] Links to related rules
- [ ] Includes appropriate tags
- [ ] Follows naming conventions
- [ ] Has clear purpose statement

Tags: #meta #structure #documentation #format
