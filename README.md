# PEACE SLIDES

React, TypeScript, and Vite worship presentation app. Quick Mode creates lyric slides and selects a worship theme automatically. Studio Mode provides detailed layout and typography controls. Guests can keep temporary projects in browser IndexedDB; signed-in users store songs, favourites, and preferences in Supabase.

## Local development

```sh
npm install
npm run dev
```

Run `npm run build` to create the Vite production build.

## Supabase accounts and cloud storage

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_APP_URL`.
3. Run `supabase/migrations/202611060001_peace_slides.sql` in the Supabase SQL editor or through the Supabase CLI.
4. In Supabase Auth URL configuration, set the Site URL to the deployed PEACE SLIDES origin and add local development and production origins to the Redirect URLs allow list. Password reset and email confirmation links return to the app root.
5. For Vercel, configure the same three public variables for Preview and Production as appropriate. Only the Supabase URL and publishable/anon key are used in the browser. Never use a service-role key in a `VITE_*` variable.

The migration creates `profiles`, `user_favourites`, `user_preferences`, and `saved_songs`. RLS policies use `auth.uid()` so each signed-in user can only read or change their own rows. Supabase Auth stores and verifies password credentials; this app never stores plaintext passwords. Guest projects remain local and are not automatically uploaded at sign-in.

## Features

- Quick Mode with Tamil/English detection, automatic title preview, section-based slide creation, weighted lyric-aware design selection, a shuffle action, immediate presenting, and PPTX export.
- Studio Mode with manual themes, custom image backgrounds, typography, lyric panel, glow, slide ordering, transitions, undo/redo, and a full-song lyric editor that regenerates slides.
- Personal favourite themes, backgrounds, fonts, text colours, and design settings when signed in.
- PEACE SLIDES watermark as a separate editable layer in preview, live mode, and PPTX files.
- Full-screen keyboard, touch, and click navigation.
- The existing IndexedDB database name is retained so local projects created by older versions remain available to guests.

## Deployment notes

`vercel.json` routes the Vite single-page app through `index.html`. Supabase account flows require a Supabase project, the migration, allowed redirect URLs, and the environment variables above. Cloud Auth, RLS, cross-device persistence, and recovery emails cannot be exercised until those project-specific settings are configured.

Themes use the existing image assets in `public/backgrounds` plus the original gradient theme collection. Font files are referenced by family name and are not embedded in the deck; the presentation computer needs fonts that support the lyrics' scripts.
