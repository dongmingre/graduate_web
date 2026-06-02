# Graduation Photo Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic React/Vite graduation blackboard photo wall using the existing 38 images in `pic/`.

**Architecture:** Create a small client-only React app with deterministic photo data, deterministic scatter layout, GSAP-powered card interactions, and a responsive glassmorphism lightbox. Static assets stay in `pic/` and are served directly from the Vite public root.

**Tech Stack:** Vite, React, TypeScript, GSAP, CSS animations.

---

## File Structure

- Create `package.json`: npm scripts and dependencies.
- Create `index.html`: Vite entry document.
- Create `tsconfig.json`: TypeScript compiler config.
- Create `tsconfig.node.json`: Vite config compiler config.
- Create `vite.config.ts`: Vite React config.
- Create `src/main.tsx`: React entry.
- Create `src/App.tsx`: Board composition and selected-photo state.
- Create `src/photoData.ts`: 38 photo records.
- Create `src/layout.ts`: deterministic responsive layout helpers.
- Create `src/components/PhotoCard.tsx`: GSAP intro, drag, hover tilt, click behavior.
- Create `src/components/Lightbox.tsx`: glass overlay and navigation.
- Create `src/styles.css`: visual system, board, cards, animations, responsive rules.
- Create `src/vite-env.d.ts`: Vite type declarations.

## Tasks

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Add Vite React project files**

Create the standard Vite React TypeScript shell with scripts: `dev`, `build`, `preview`, and `typecheck`.

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: `node_modules/` and `package-lock.json` are created.

### Task 2: Data and Layout

**Files:**
- Create: `src/photoData.ts`
- Create: `src/layout.ts`

- [ ] **Step 1: Define all photo records**

Create 38 records with paths `/pic/1.jpg` through `/pic/38.jpg`, short captions, and aspect-ratio variants.

- [ ] **Step 2: Define deterministic scatter layout**

Create helper functions that map each photo index to responsive `x`, `y`, `rotation`, `width`, `zIndex`, `delay`, `tapeRotation`, and `aspectRatio` values.

### Task 3: Components and Interaction

**Files:**
- Create: `src/components/PhotoCard.tsx`
- Create: `src/components/Lightbox.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Build `PhotoCard`**

Render a taped polaroid card. Use GSAP for intro scatter, hover tilt, and Draggable when available.

- [ ] **Step 2: Build `Lightbox`**

Render the selected photo in a glass overlay with close, previous, and next controls plus keyboard Escape support.

- [ ] **Step 3: Compose `App`**

Render the board, title, chalk notes, all cards, hint text, cinematic overlays, and lightbox state.

### Task 4: Styling and Polish

**Files:**
- Create: `src/styles.css`

- [ ] **Step 1: Implement cinematic blackboard styling**

Style wood frame, chalk texture, letterbox vignette, projector sweep, film grain, title, doodles, cards, tape, shadows, and glass overlay.

- [ ] **Step 2: Add responsive rules**

Ensure cards remain inside a usable viewport on mobile and lightbox controls do not overlap photo content.

### Task 5: Verification

**Files:**
- Modify only if verification finds defects.

- [ ] **Step 1: Typecheck and build**

Run: `npm run build`

Expected: TypeScript and Vite build pass.

- [ ] **Step 2: Start dev server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a localhost URL.

- [ ] **Step 3: Browser verification**

Open the localhost URL. Verify the page renders, cards animate in, lightbox opens and closes, next/previous controls work, drag works, and mobile viewport does not visibly overlap core controls.

