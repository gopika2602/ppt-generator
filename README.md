# Worship Studio

Responsive worship presentation editor built with React, TypeScript, and Vite. It creates editable 16:9 PowerPoint decks with PptxGenJS and stores projects in the browser's IndexedDB.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, and serve that build with `npm run preview`.

## Deploy to Vercel

This project is configured for Vercel with `npm run build`, the `dist` output directory, and an SPA rewrite to `index.html`. No server environment variables or private API keys are required for the current client-side features.

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import that repository, and select the `peaceag-ppt-generator` project name if you want the default domain `peaceag-ppt-generator.vercel.app`.
3. Confirm the build command is `npm run build` and the output directory is `dist` (Vercel can detect Vite automatically).
4. Deploy. Vercel will build the production branch and create preview deployments for pull requests; future pushes trigger deployments automatically.

The Vercel configuration also rewrites app paths to the SPA entry point, so refreshing a nested path still serves the application. Project data and uploaded images stay in the visitor's browser IndexedDB.

## Features

- Original gradient theme library with eight categories, search, and locally saved favourites.
- Song lyric entry, section label detection, repeated stanza detection, structure review, slide generation, direct slide text editing, slide reordering, duplication, deletion, splitting, and merging.
- Scripture project type with a reference field and exact text entry.
- Glass style lyric panels, adjustable panel opacity, text colour, font family, size, and glow.
- Custom image backgrounds saved with the project in IndexedDB and embedded in PowerPoint exports.
- Full screen live presentation with keyboard and touch navigation, black screen shortcut, and live fade, dissolve, push, and wipe effects.
- PPTX export with editable text, embedded image or theme backgrounds, 16:9 sizing, and supported text styling.
- Autosaved projects, project search, and portable JSON backup and restore.

## Notes and limitations

- PowerPoint transitions are not written by the current PptxGenJS version used here. Transition choices apply to browser live mode; exported decks open with the standard PowerPoint slide behavior.
- Fonts are referenced by name rather than embedded. Install the selected font, including Noto Sans Tamil or another Tamil capable font, on the presentation computer for the closest match. Text remains Unicode and editable in the PPTX.
- The theme collection is generated from original gradients; uploaded images are embedded. Image crop controls, tonal adjustments, custom theme authoring, and multiple typography profiles are not included yet.
- The local browser preview could not be opened through the available in-app browser in this environment. The production build succeeded, and a generated Tamil + English deck opened in desktop PowerPoint with editable text visible.

## Structure

```text
src/
  engine/   lyric detection, themes, IndexedDB, PPTX export
  ui/       responsive React interface and styles
  types.ts  project, section, theme, and slide types
```
