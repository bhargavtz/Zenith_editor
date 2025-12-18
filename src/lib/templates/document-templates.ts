export interface DocumentTemplate {
    id: string
    name: string
    description: string
    category: 'resume' | 'report' | 'article' | 'notes' | 'technical' | 'creative'
    tags: string[]
    content: string
    thumbnail?: string
}

// Resume Template
export const resumeTemplate: DocumentTemplate = {
    id: 'resume-professional',
    name: 'Professional Resume',
    description: 'Modern resume template with clean sections',
    category: 'resume',
    tags: ['resume', 'cv', 'job', 'professional'],
    content: `# [Your Name]

**[Your Title/Position]** | [City, State] | [Email] | [Phone] | [LinkedIn]

---

## Summary

Results-driven professional with [X] years of experience in [your field]. Proven track record of [key achievement]. Seeking to leverage expertise in [skills] to drive [company goal].

---

## Experience

### [Job Title] | [Company Name]
*[Start Date] - [End Date/Present]* | [Location]

- Achieved [specific accomplishment with metrics]
- Led [project/initiative] resulting in [measurable outcome]
- Collaborated with [team/department] to [achievement]
- Implemented [solution] that improved [metric] by [percentage]

### [Job Title] | [Company Name]
*[Start Date] - [End Date]* | [Location]

- [Achievement with quantifiable results]
- [Key responsibility or project]
- [Impact or outcome]

---

## Education

### [Degree] in [Field of Study]
**[University Name]** | [Graduation Year]
- GPA: [X.XX/4.0] (if notable)
- Relevant coursework: [Course 1], [Course 2], [Course 3]
- Honors: [Dean's List, Scholarships, etc.]

---

## Skills

**Technical:** [Skill 1] • [Skill 2] • [Skill 3] • [Skill 4]

**Languages:** [Language 1] (Native) • [Language 2] (Fluent) • [Language 3] (Conversational)

**Tools:** [Tool 1] • [Tool 2] • [Tool 3] • [Tool 4]

---

## Certifications

- **[Certification Name]** - [Issuing Organization] ([Year])
- **[Certification Name]** - [Issuing Organization] ([Year])

---

## Projects

### [Project Name]
*[Technology Stack]*

Brief description of the project, your role, and the impact. Include metrics if possible.

- [Key feature or achievement]
- [Technology or methodology used]
- [Result or outcome]
`
}

// Business Report Template
export const businessReportTemplate: DocumentTemplate = {
    id: 'report-business',
    name: 'Business Report',
    description: 'Professional business report with executive summary',
    category: 'report',
    tags: ['business', 'report', 'analysis', 'professional'],
    content: `# [Report Title]

**Prepared by:** [Your Name]  
**Date:** ${new Date().toLocaleDateString()}  
**Department:** [Department Name]  
**For:** [Recipient/Audience]

---

## Executive Summary

> A concise overview of the report's key findings and recommendations (2-3 paragraphs)

This report examines [topic/issue]. Our analysis reveals [key finding]. Based on these findings, we recommend [main recommendation].

Key highlights:
- [Finding 1]
- [Finding 2]
- [Finding 3]

---

## 1. Introduction

### 1.1 Background
[Provide context for the report]

### 1.2 Objectives
The primary objectives of this report are to:
1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

### 1.3 Scope
[Define what is and isn't covered in this report]

---

## 2. Methodology

Our analysis included:
- **Data Sources:** [List primary and secondary sources]
- **Timeframe:** [Period covered]
- **Approach:** [Quantitative/Qualitative methods used]

---

## 3. Findings

### 3.1 [Finding Category 1]

[Detailed analysis of first major finding]

| Metric | Current | Target | Variance |
|--------|---------|--------|----------|
| [Metric 1] | 85% | 90% | -5% |
| [Metric 2] | $2.5M | $3M | -$500K |

### 3.2 [Finding Category 2]

[Detailed analysis of second major finding]

### 3.3 [Finding Category 3]

[Detailed analysis of third major finding]

---

## 4. Analysis

### 4.1 Strengths
- [Strength 1]
- [Strength 2]

### 4.2 Weaknesses
- [Weakness 1]
- [Weakness 2]

### 4.3 Opportunities
- [Opportunity 1]
- [Opportunity 2]

### 4.4 Threats
- [Threat 1]
- [Threat 2]

---

## 5. Recommendations

### Priority 1: [Recommendation Title]
**Impact:** High | **Effort:** Medium | **Timeline:** 3-6 months

[Detailed recommendation with rationale and implementation steps]

### Priority 2: [Recommendation Title]
**Impact:** Medium | **Effort:** Low | **Timeline:** 1-3 months

[Detailed recommendation]

### Priority 3: [Recommendation Title]
**Impact:** Medium | **Effort:** High | **Timeline:** 6-12 months

[Detailed recommendation]

---

## 6. Conclusion

[Summarize key points and call to action]

---

## Appendices

### Appendix A: Data Tables
[Detailed data]

### Appendix B: References
[List of sources]
`
}

// Technical Documentation Template
export const technicalDocTemplate: DocumentTemplate = {
    id: 'doc-technical',
    name: 'Technical Documentation',
    description: 'Developer-friendly API and software documentation',
    category: 'technical',
    tags: ['technical', 'documentation', 'api', 'code'],
    content: `# [Project/API Name]

> Version 1.0.0 | Last Updated: ${new Date().toLocaleDateString()}

A brief description of what this project/API does and its primary purpose.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Install via npm
\`\`\`bash
npm install [package-name]
\`\`\`

### Install via yarn
\`\`\`bash
yarn add [package-name]
\`\`\`

---

## Quick Start

\`\`\`javascript
import { ExampleClass } from '[package-name]'

// Initialize
const instance = new ExampleClass({
  apiKey: 'your-api-key',
  baseURL: 'https://api.example.com'
})

// Make a request
const result = await instance.doSomething()
console.log(result)
\`\`\`

---

## API Reference

### \`ClassName\`

Main class for interacting with the API.

#### Constructor

\`\`\`typescript
new ClassName(options: ClassOptions)
\`\`\`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| \`apiKey\` | string | Yes | Your API authentication key |
| \`baseURL\` | string | No | Custom base URL (default: https://api.example.com) |
| \`timeout\` | number | No | Request timeout in ms (default: 5000) |

#### Methods

##### \`methodName(param: Type): Promise<ReturnType>\`

Description of what this method does.

**Parameters:**
- \`param\` (Type): Description of parameter

**Returns:**
- Promise<ReturnType>: Description of return value

**Example:**
\`\`\`javascript
const result = await instance.methodName('value')
console.log(result) // { success: true, data: {...} }
\`\`\`

**Throws:**
- \`ValidationError\`: When input is invalid
- \`APIError\`: When API request fails

---

## Examples

### Example 1: Basic Usage

\`\`\`javascript
// Your code example here
\`\`\`

### Example  2: Advanced Usage

\`\`\`javascript
// More complex example
\`\`\`

### Example 3: Error Handling

\`\`\`javascript
try {
  const result = await instance.riskyOperation()
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message)
  } else {
    console.error('Unexpected error:', error)
  }
}
\`\`\`

---

## Configuration

### Environment Variables

\`\`\`bash
API_KEY=your_api_key_here
BASE_URL=https://api.example.com
TIMEOUT=5000
LOG_LEVEL=info
\`\`\`

### Config File

Create a \`.configrc.json\` file:

\`\`\`json
{
  "apiKey": "your_api_key",
  "baseURL": "https://api.example.com",
  "timeout": 5000,
  "retries": 3
}
\`\`\`

---

## Troubleshooting

### Common Issues

#### "API Key Invalid" Error

**Problem:** Authentication fails with 401 error

**Solution:** 
1. Verify your API key is correct
2. Check if the key has been activated
3. Ensure the key has the required permissions

#### Timeout Errors

**Problem:** Requests timeout before completing

**Solution:**
- Increase timeout in configuration
- Check network connectivity
- Verify API endpoint is accessible

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

---

## License

MIT License - see [LICENSE](LICENSE) file for details
`
}

// Blog Article Template
export const blogArticleTemplate: DocumentTemplate = {
    id: 'article-blog',
    name: 'Blog Article',
    description: 'Engaging blog post template with SEO structure',
    category: 'article',
    tags: ['blog', 'article', 'writing', 'content'],
    content: `# [Your Compelling Title Here]

*Published on ${new Date().toLocaleDateString()} by [Author Name]*

![Featured Image](https://via.placeholder.com/800x400)

> **TL;DR:** Brief summary of what readers will learn in 1-2 sentences.

---

## Introduction

Hook your readers with a compelling opening. Start with:
- A surprising statistic
- A relatable problem
- An intriguing question

[2-3 paragraphs introducing the topic and why it matters]

In this article, you'll learn:
- [Key takeaway 1]
- [Key takeaway 2]
- [Key takeaway 3]

---

## [Main Point 1]

### The Problem

Describe the challenge or issue your readers face.

### The Solution

Provide actionable advice or insights.

**Pro Tip:** 💡 [Quick win or insider knowledge]

---

## [Main Point 2]

Real-world example or case study:

> "Quote from expert or user that adds credibility"  
> — **Person Name**, Title

### Step-by-Step Guide

1. **Step 1:** Clear instruction
   - Detail or example
   - Additional context

2. **Step 2:** Next action
   - Explanation
   - Visual or code example

3. **Step 3:** Final step
   - Wrap-up
   - Expected outcome

---

## [Main Point 3]

### Common Mistakes to Avoid

❌ **Mistake 1:** What not to do  
✅ **Instead:** What to do

❌ **Mistake 2:** Another pitfall  
✅ **Instead:** Better approach

---

## Code Example (if technical)

\`\`\`javascript
// Clear, well-commented code example
function example() {
  // Explain what this does
  return "value"
}
\`\`\`

---

## Key Takeaways

Let's recap what we've covered:

- 📌 **Point 1:** Brief summary
- 📌 **Point 2:** Key insight
- 📌 **Point 3:** Main lesson
- 📌 **Point 4:** Action item

---

## Conclusion

Wrap up your article by:
1. Reinforcing the main message
2. Inspiring action
3. Inviting engagement

**What's your experience with [topic]? Share in the comments below!**

---

## Further Reading

- [Related Article 1](https://example.com)
- [Related Article 2](https://example.com)
- [Resource or Tool](https://example.com)

---

*Want more content like this? [Subscribe to our newsletter](#) for weekly insights!*

**Tags:** #[tag1] #[tag2] #[tag3]
`
}

// Meeting Notes Template
export const meetingNotesTemplate: DocumentTemplate = {
    id: 'notes-meeting',
    name: 'Meeting Notes',
    description: 'Structured meeting notes with action items',
    category: 'notes',
    tags: ['meeting', 'notes', 'business', 'collaboration'],
    content: `# [Meeting Title]

**Date:** ${new Date().toLocaleDateString()}  
**Time:** [Start Time] - [End Time]  
**Location:** [Room/Virtual Link]  
**Facilitator:** [Name]  
**Note Taker:** [Name]

## Attendees

**Present:**
- [Name] - [Role]
- [Name] - [Role]
- [Name] - [Role]

**Absent:**
- [Name] - [Role] (with notice)

---

## Agenda

1. [Agenda Item 1] (10 mins)
2. [Agenda Item 2] (15 mins)
3. [Agenda Item 3] (20 mins)
4. [Agenda Item 4] (10 mins)
5. Next Steps (5 mins)

---

## Discussion

### 1. [Topic 1]

**Presenter:** [Name]

**Key Points:**
- [Point discussed]
- [Decision made]
- [Concern raised]

**Outcome:** [Summary of what was decided]

---

### 2. [Topic 2]

**Key Discussion:**
[Summary of discussion]

**Decisions Made:**
- ✅ [Decision 1]
- ✅ [Decision 2]

**Open Questions:**
- ❓ [Question needing follow-up]

---

## Action Items

| Task | Owner | Due Date | Priority | Status |
|------|-------|----------|----------|--------|
| [Action item 1] | [Name] | [Date] | High | 🔴 Not Started |
| [Action item 2] | [Name] | [Date] | Medium | 🟡 In Progress |
| [Action item 3] | [Name] | [Date] | Low | 🟢 Complete |

---

## Decisions Summary

1. **[Decision 1]:** [Details and rationale]
2. **[Decision 2]:** [Details and rationale]
3. **[Decision 3]:** [Details and rationale]

---

## Parking Lot

Items to discuss in future meetings:
- [ ] [Topic 1]
- [ ] [Topic 2]
- [ ] [Topic 3]

---

## Next Meeting

**Date & Time:** [Date] at [Time]  
**Agenda Preview:**
- [Item 1]
- [Item 2]

**Pre-work:** [What attendees should prepare]

---

## Notes

[Additional context, quotes, or observations]
`
}

// All Templates Registry
export const documentTemplates: DocumentTemplate[] = [
    resumeTemplate,
    businessReportTemplate,
    technicalDocTemplate,
    blogArticleTemplate,
    meetingNotesTemplate
]

export function getTemplateById(id: string): DocumentTemplate | undefined {
    return documentTemplates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): DocumentTemplate[] {
    return documentTemplates.filter(t => t.category === category)
}

export const templateCategories = [
    { id: 'resume', label: 'Resume & CV', icon: '📄' },
    { id: 'report', label: 'Reports', icon: '📊' },
    { id: 'article', label: 'Articles & Blogs', icon: '✍️' },
    { id: 'notes', label: 'Notes & Docs', icon: '📝' },
    { id: 'technical', label: 'Technical', icon: '💻' },
    { id: 'creative', label: 'Creative', icon: '🎨' }
]
