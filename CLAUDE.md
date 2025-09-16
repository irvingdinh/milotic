# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Starts local dev server at `localhost:4321`
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview build locally before deploying

### Code Quality
- `pnpm lint` - Run ESLint on `.js`, `.ts`, `.tsx`, `.astro` files
- `pnpm lint:fix` - Auto-fix ESLint issues

### Package Management
Always use `pnpm` commands, not `npm` or `yarn`.

## Architecture

### Tech Stack
- **Astro** - Static site generator with islands architecture for selective hydration
- **Preact** - Lightweight React alternative for interactive components
- **TypeScript** - Strict mode enabled for type safety
- **Tailwind CSS v4** - Using new @tailwindcss/vite plugin with CSS-based configuration
- **DaisyUI** - Component library with silk (light) and abyss (dark) themes
- **Firebase** - Authentication with automatic anonymous sign-in fallback
- **Nanostores** - Global state management with reactive atoms

### Project Structure
- `src/pages/` - Astro pages defining routes
- `src/widgets/` - Feature-based component organization (e.g., `rewrite/`)
- `src/components/` - Shared UI components and icons
- `src/stores/` - Nanostores for global state (auth-store.ts)
- `src/libs/` - Third-party integrations (firebase.ts)
- `src/styles/global.css` - Tailwind imports and DaisyUI theme configuration

### Key Patterns

#### Component Development
- Export main component at top of file
- Use functional components with hooks
- Import components with full extensions: `"../widgets/auth/AuthWidget.tsx"`
- Use `client:only="preact"` directive for interactive islands in Astro

#### State Management
- Firebase auth state centralized in `auth-store.ts` using nanostores
- Components consume stores via `@nanostores/preact` hooks
- Auth automatically falls back to anonymous sign-in if no user

#### API Integration
- Proxy `/api` requests to `http://localhost:32181` (configured in Vite)
- Use Firebase ID tokens for authorization: `await user.getIdToken()`
- Handle streaming responses with TextDecoder for real-time updates

#### Styling
- Tailwind CSS v4 with CSS-based configuration
- DaisyUI components (card, btn, alert, textarea, etc.)
- Theme-aware components using base-100, base-200 color tokens

### Development Guidelines

#### Import Order
1. External packages
2. Internal modules (with full file extensions in Astro)
3. Use `type` keyword for type-only imports

#### TypeScript
- Strict mode enabled
- Explicit return types when not obvious
- Proper typing for Firebase objects and nanostores

#### ESLint Rules
- Import sorting enforced
- No console.log (warn/error allowed)
- Unused vars must start with underscore
- JSX accessibility rules enabled

#### Git Commits
Follow conventional commits with past tense:
- `feat: Added new feature`
- `fix: Fixed bug in component`
- `chore: Updated dependencies`
Use backticks for code references: `Fixed bug in \`auth-store.ts\``

### Testing
No testing framework currently configured. Consider adding Vitest for Astro compatibility if tests are needed.