# Contributing to Zenith Editor

Thank you for considering contributing to Zenith Editor! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive. We want this to be a welcoming community for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** - Descriptive summary of the issue
- **Steps to reproduce** - Detailed steps to recreate the problem
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Environment** - OS, browser, Node version, etc.
- **Screenshots** - If applicable

### Suggesting Features

Feature suggestions are welcome! Please include:

- **Use case** - Why this feature would be useful
- **Proposed solution** - How you envision it working
- **Alternatives** - Other approaches you've considered
- **Additional context** - Mockups, examples, etc.

### Pull Requests

1. **Fork and clone** the repository
2. **Create a branch** - `git checkout -b feature/your-feature-name`
3. **Make your changes** - Follow the coding standards below
4. **Test thoroughly** - Ensure nothing is broken
5. **Commit** - Use clear, descriptive commit messages
6. **Push** - `git push origin feature/your-feature-name`
7. **Open a PR** - Describe your changes and link any related issues

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Define proper types/interfaces
- Avoid `any` type where possible
- Use meaningful variable names

### React

- Use **functional components** with hooks
- Follow React best practices
- Keep components focused and reusable
- Use proper prop typing

### Styling

- Use **TailwindCSS** utility classes
- Follow existing patterns for consistency
- Keep styles scoped to components
- Use CSS variables for theming

### File Structure

```
src/
├── components/       # Reusable UI components
├── lib/             # Utility functions and logic
├── stores/          # State management (Zustand)
└── styles/          # Global styles
```

### Naming Conventions

- **Components**: PascalCase (e.g., `TemplateGallery.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase with descriptive names

### Commit Messages

Follow conventional commits:

```
feat: add PDF template selector
fix: resolve document switching bug
docs: update README installation steps
style: format code with prettier
refactor: simplify export dialog logic
test: add PDF export tests
chore: update dependencies
```

## Testing

- Test your changes manually
- Ensure existing features still work
- Consider edge cases
- Add tests for new features (when test suite is added)

## Documentation

- Update README.md if adding features
- Add JSDoc comments for complex functions
- Update type definitions as needed
- Include examples for new APIs

## Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be in the next release!

## Questions?

- Open an issue for questions
- Email: bhargav05@yandex.com

Thank you for contributing! 🎉
