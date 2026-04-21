# Combat Atlas Frontend Guidelines

## Code Style

- **TypeScript**: Strict mode enabled (noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch). Use path alias `@` for `./src/`.
- **Components**: PascalCase naming (e.g., `FighterCard.tsx`). Each component in its own folder with `index.tsx` barrel export, `COMPONENT_NAME.types.ts` for interfaces.
- **Styling**: Hybrid MUI + SCSS. Use MUI `sx` prop for responsive design (breakpoints: 768px tablet, 1200px desktop). Centralize colors in config files, avoid hardcoding.
- **Linting**: ESLint with React hooks and refresh plugins. Run `npm run lint` before commits.

## Architecture

- **State Management**: Redux Toolkit with slices for fighters, mainEvents, topEvents. Use async thunks for API calls with session storage caching (30-min TTL).
- **Routing**: React Router v7 with nested routes. SPA deployed on Vercel with rewrite to `/`.
- **Component Structure**: Pages dispatch actions, pass data as props to reusable components. Country-specific configs (theme, data, resources) enable scalable multi-regional content.
- **Data Flow**: API → Redux thunks → store → selectors → props. No Redux Saga (dependency unused).

## Build and Test

- **Install**: `npm install`
- **Dev Server**: `npm run dev` (Vite with HMR)
- **Build**: `npm run build` (TypeScript check + Vite build)
- **Lint**: `npm run lint`
- **Preview**: `npm run preview`
- **Test**: None configured—consider adding Jest/Vitest for scaling.

## Conventions

- **File Organization**: `src/pages/` for country pages, `src/components/` for reusable UI, `src/store/` for Redux, `src/services/` for API.
- **Naming**: Types files as `*.types.ts` (fix inconsistencies like `fighterCard.types.ts` to `FighterCard.types.ts`).
- **Theming**: Per-country MUI themes with custom palettes. Use neo-brutalist design: bold borders, drop shadows, stark contrasts.
- **Error Handling**: Use `ErrorFallback` component. Thunk errors as string payloads.
- **Environment**: Set `VITE_API_URL` for API base URL (defaults to `http://localhost:3000/api`).
