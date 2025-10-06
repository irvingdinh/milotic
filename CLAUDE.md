# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm install` - Install dependencies
- `pnpm dev` - Start local development server at `localhost:4321`
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint on `.js`, `.ts`, `.tsx`, and `.astro` files
- `pnpm lint:fix` - Auto-fix ESLint issues

## Architecture

This is an **Astro + Preact** application with server-side rendering, Firebase authentication, and Tailwind CSS styling.

### Technology Stack
- **Astro** - Server-side rendered framework with islands architecture
- **Preact** - Lightweight React alternative for interactive components
- **TypeScript** - Type safety throughout the codebase
- **Firebase Auth** - User authentication with automatic anonymous sign-in
- **Nanostores** - Lightweight state management for global state
- **Tailwind CSS v4** - Utility-first CSS framework (using @tailwindcss/vite)
- **Node.js adapter** - Deployed as standalone Node.js server

### Project Structure
- `src/pages/` - Astro pages defining routes
- `src/components/` - Shared UI components (`.astro` and `.tsx` files)
- `src/libs/` - Core libraries and integrations
  - `firebase.ts` - Firebase initialization and service exports
  - `auth-store.ts` - Global authentication state using nanostores
- `src/styles/` - Global styles and Tailwind configuration
- `src/widgets/` - Feature-specific component modules (planned)

### Key Patterns

#### State Management
Global state is managed with nanostores. Auth state is centralized in `auth-store.ts`:
```typescript
export const authStore = atom<{ user: User | null; loading: boolean }>
```

#### Firebase Integration
- Configuration and initialization in `src/libs/firebase.ts`
- Automatic anonymous authentication as fallback
- Real-time auth state updates via `onAuthStateChanged`

#### Component Architecture
- Astro components (`.astro`) for static/SSR content
- Preact components (`.tsx`) for interactive islands
- JSX configured to use Preact runtime

### Configuration Notes
- Server output mode with Node.js standalone adapter
- Proxy configured for `/api` routes to `https://irving.dev`
- TypeScript strict mode enabled
- ESLint configured for all relevant file types