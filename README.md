# Lmst — tiny, no-fuss Mastodon web client

<p align="center">
  <img src="screenshots/logo.png" width="200" alt="Lmst logo">
</p>

Lmst is a lightweight Mastodon web client built around a simple idea:
deliver the essential social experience with a **tiny bundle** and a **clear, classic UI**.

## Highlights

- **Tiny JS bundle**: **up to 10 kB** (brotli). Hard requirement.
- **Classic layout**: minimal UI that feels like a website, not a heavy web app.
- **Zero runtime dependencies**: fewer moving parts and long-term stability.

## Features

- Follow and unfollow profiles
- Compose statuses and replies with image attachments
- Distraction‑free compose mode (zen)
- Boost and unboost statuses
- Search profiles, statuses, and hashtags
- Delete your own statuses
- View notifications

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Size budget

The bundle size limit is enforced by the `size-limit` configuration in
`package.json` (`dist/assets/*.js`, **10 kB**). Keep changes lean.

## Contributing

Small, focused contributions are welcome. Please keep the size budget in mind.

## License

MIT. See `LICENSE`.
