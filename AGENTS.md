# AGENTS.md

## Project overview

This repository is a small React application bootstrapped with Create React App. The app entry is in [src/App.js](src/App.js), with styling in [src/App.css](src/App.css) and global styles in [src/index.css](src/index.css). The test setup lives in [src/App.test.js](src/App.test.js) and uses React Testing Library.

Use the project documentation in [README.md](README.md) as the source of truth for standard CRA commands and expectations.

## Working conventions

- Prefer the existing React + functional component style already used in the project.
- Keep changes small and focused; avoid introducing new frameworks or build tooling unless the task explicitly requires it.
- Favor the current CSS organization over adding new styling systems or component libraries.
- For UI changes, validate behavior with tests when possible and keep assertions aligned with Testing Library patterns.
- Do not eject the app or change the build configuration unless the task explicitly calls for it.

## Essential commands

- Install dependencies: `npm install`
- Start the app locally: `npm start`
- Run tests interactively: `npm test`
- Run tests once in CI mode: `npm test -- --watch=false`
- Create a production build: `npm run build`

## Key files

- [package.json](package.json): app scripts and dependencies
- [src/App.js](src/App.js): main application component
- [src/App.test.js](src/App.test.js): app-level test example
- [src/index.js](src/index.js): React mount point
- [public/index.html](public/index.html): base HTML shell

## Guidance for AI coding agents

- Prefer edits that maintain the CRA default structure and naming conventions.
- When fixing or adding tests, use `@testing-library/react` and assert on visible user-facing behavior.
- If a task includes UI work, check [src/App.js](src/App.js) and [src/App.css](src/App.css) before making structural changes.
- For any new component or page, keep the implementation simple and consistent with the established app size and architecture.
