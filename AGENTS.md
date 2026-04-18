# Agent Guidance for phi-chart-render

## Dev Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server on port 9000 |
| `npm run dev:prod` | Dev server with production mode |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run build:dev` | Build with development mode |

## Key Config Details

- **Dev server**: `http://0.0.0.0:9000` (auto-opens in browser)
- **Build base path**: `/phi-chart-render/` (important for relative paths)
- **Entry point**: `src/main.js`
- **Source map**: Enabled in build by default

## Architecture

- **Chart parsing**: `src/chart/convert/` - handles official, phiedit, rephiedit formats
- **Rendering**: `src/chart/` - note.js, judgment line rendering
- **Audio timing**: `src/audio/` - clock, timer, unmute handling
- **Effects**: `src/effect/` - shaders (glsl presets in `effect/shader/presets/`)

## CI/CD

- GitHub Pages deployment on push to master (via `npm run build`)
- Builds to `./dist` directory
- Sentry sourcemap upload configured in workflow

## Note

This project is deprecated (see README.md). Security patches may still be relevant, but new features are unlikely.