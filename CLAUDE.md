# CLAUDE.md - OpenDevTools Project Guidelines

## Project Overview

OpenDevTools is a client-side developer tools web application built with Next.js 15,
Tailwind CSS v4, and shadcn/ui. All processing happens in the browser - no server-side
data handling.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 (CSS-first configuration, no tailwind.config.ts)
- **Components**: shadcn/ui (New York style, default components only)
- **Package Manager**: pnpm
- **Icons**: Lucide React only
- **Theme**: next-themes for dark/light mode
- **Language**: TypeScript (strict mode)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [tool-name]/       # Each tool has its own route at root level
│   │   └── page.tsx
│   ├── globals.css        # Tailwind v4 + shadcn theme
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page with tool grid
├── components/
│   ├── ui/                # shadcn/ui components (do not modify)
│   ├── layout/            # Layout components (navbar, sidebar)
│   ├── shared/            # Reusable components (copy-button, etc.)
│   └── theme/             # Theme provider and toggle
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and tool configuration
└── types/                 # TypeScript type definitions
```

## Code Conventions

### General Rules

- All tools process data client-side only
- No login, authentication, or user tracking
- No external API calls for data processing
- Desktop-only UI (mobile shows warning message)

### Component Guidelines

- Use only default shadcn/ui components (no custom styling modifications)
- Import icons only from lucide-react
- All tool output areas must include a copy button
- Use `"use client"` directive only when necessary (hooks, interactivity)

### URL Structure

- Tools are at root level: `/json-to-yaml`, `/json-format`, etc.
- NO nested routes like `/tools/json-to-yaml`

### Styling Rules

- Use Tailwind CSS utility classes only
- No custom CSS beyond globals.css theme variables
- Follow shadcn/ui's existing patterns
- Dark mode must work correctly with all components

### TypeScript

- Strict mode enabled
- Define interfaces in src/types/ or inline when simple
- Use proper typing for all props and state

## Adding New Tools

1. Create route folder: `src/app/[tool-name]/page.tsx`
2. Add tool to `src/lib/tools-config.ts` with:
   - name: Display name
   - path: URL path (root level)
   - description: Brief description
   - icon: Lucide icon component
3. Implement tool as a client component with:
   - Input area (textarea or appropriate input)
   - Output area with CopyButton
   - Error handling for invalid input
4. All processing must happen client-side

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Dependencies for Tools

When implementing specific tools, these packages are available:

- `js-yaml` - JSON to YAML conversion
- `diff` - Text diff comparison
- Markdown: Use native browser rendering or add minimal library as needed

## Important Notes

- Tailwind v4 uses CSS-first config (no tailwind.config.ts)
- shadcn/ui components use OKLCH color space
- Sidebar state persists via cookies
- The app is hidden on mobile viewports (<768px)
- Default theme is dark mode
