# Photobooth Web App

A small photobooth-style web app built with React. It guides users through taking or uploading photos, creates a photostrip, and allows adding fun stickers before downloading the final image.

## Features

- **Home / Menu flow**
- **Camera capture flow** (2-step capture and photostrip composition)
- **Upload flow** (use an existing image)
- **Final editor**
  - Add stickers (fish, octopus, seaweed variants, bubbles variants, axolotl)
  - Drag and reposition stickers on canvas
  - Reset stickers
  - Download the final image

## Tech Stack

- React
- React Router
- Create React App (react-scripts)
- HTML Canvas APIs

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Scripts

- `npm start`
  - Run dev server
- `npm run build`
  - Build production bundle to `build/`
- `npm test`
  - Run tests

## Project Structure

- `src/`
  - `components/` – page and UI components (Home, Menu, Camera, Upload, Final)
  - `utils/` – helper functions for camera/canvas/final composition
- `public/`
  - `Assets/` – all images and art assets
  - `styles/` – global page styles loaded via `public/index.html`

## Assets & Paths

Static images live under `public/Assets/...` and are referenced with absolute paths like:

- `/Assets/fish-photobooth/...`

## Notes

- The camera page requires browser camera permission.
- The photostrip image is stored in `localStorage` temporarily to pass data between pages.
