# Blue Dictionary / Project guide

[← README](../README.md)

Complete setup, behavior and technical notes. Unless stated otherwise, run commands from the repository root.

A Chinese word explorer with fuzzy search, explanations, audio playback and shareable word views.

## Features

- Search the bundled Chinese word collection with fuzzy matching.
- Open explanations, browse adjacent entries or discover a random word.
- Listen to available audio and share an individual word.

## Getting started

```sh
npm ci
npm run dev
```

Open the address printed by Next.js (normally http://localhost:3000).

## Project notes

Built with Next.js, React, Tailwind CSS, Fuse.js and browser audio. Word data lives in `public/data/`; UI components are in `components/`, with playback state in `contexts/`.

## Development

```sh
npm run lint
npm run build
npm start
```

Banner sources and update instructions: [README artwork](readme/README.md).
