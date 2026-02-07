# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Architecture

This is a Vue 3 application built with Vite. The project uses the Composition API with `<script setup>` syntax throughout.

### Tech Stack
- **Vue 3** - Frontend framework using Composition API
- **Vite** - Build tool and dev server
- **Pinia** - State management (stores are in `src/stores/`)
- **Vue Router** - Client-side routing (configured in `src/router/index.js`)

### Entry Point
- `index.html` - HTML entry point that mounts the `#app` div
- `src/main.js` - Application entry point, initializes Pinia and Router

### Path Aliases
The `@` alias is configured to point to `src/` directory (defined in `vite.config.js`). Use it for imports like `import Foo from '@/components/Foo.vue'`

### Routing
Routes are defined in `src/router/index.js` using `createWebHistory`. The app currently has two routes: `/` (home) and `/about`.

### State Management
Pinia stores use the Composition API style with `defineStore`. Stores are auto-imported where needed (no explicit registration required).

### Component Organization
- `src/components/` - Reusable Vue components
- `src/views/` - Page-level components tied to routes
- `src/components/icons/` - Icon components

### Build Configuration
- Node version requirement: `^20.19.0 || >=22.12.0`
- Vite config includes Vue DevTools plugin for debugging
