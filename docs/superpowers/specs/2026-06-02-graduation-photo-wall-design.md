# Graduation Photo Wall Design

## Goal

Build a polished React/Vite graduation photo wall using the existing `pic/1.jpg` through `pic/38.jpg` assets. The page should feel like a cinematic graduation opening sequence that settles into an interactive blackboard memory wall.

## Visual Direction

The main surface is a full-screen green-black classroom blackboard with a subtle wooden frame, chalk dust, hand-drawn chalk marks, and restrained film grain. The experience opens with a dark cinematic mood: a projected light sweep, letterbox vignette, handwritten title reveal, then photo cards fly out from a central stack and land across the board.

The core style combines:

- Minimal composition with one full-screen board.
- Refined details: wood frame, chalk texture, tape, shadows, handwritten captions.
- Glassmorphism only for focused states and the photo viewer, not as decoration everywhere.
- Filmic motion: opening sequence, camera push, staggered scatter, floating cards, hover lift.

## Interaction

- Render all 38 photos as polaroid-like cards.
- Initial layout uses deterministic scattered positions so the page feels composed and does not randomly break on reload.
- Cards can be dragged around the board.
- Hovering or moving over a card gives a subtle 3D tilt and lift.
- Clicking a card opens a glassmorphism viewer overlay with the selected photo, caption, index, and next/previous controls.
- Escape and backdrop click close the viewer.
- The interface remains useful on mobile by reducing card count density on screen and keeping the overlay responsive.

## Architecture

Use a small Vite React app. Keep data, layout generation, and visual components separated enough to remain editable:

- `src/photoData.ts` defines photo paths and display metadata.
- `src/layout.ts` defines deterministic card positions and responsive helpers.
- `src/App.tsx` owns selected photo state and composes the board.
- `src/components/PhotoCard.tsx` handles card rendering, drag, hover tilt, and click.
- `src/components/Lightbox.tsx` renders the glass viewer.
- `src/styles.css` owns the visual system and animations.

## Libraries

- Vite + React + TypeScript for the app shell.
- GSAP for intro sequencing, drag interactions, and polished transforms.
- No extra visual component library; the design is custom and small.

## Verification

- `npm run build` must pass.
- Run the dev server and inspect the page in a browser.
- Verify all 38 images are discoverable in the DOM or rendered data.
- Verify open/close lightbox, next/previous navigation, drag, hover, and responsive layout.

