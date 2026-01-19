# Background

A browser extension that sets a custom background image for all websites.

<img width="1280" height="800" alt="Snipaste_2026-01-16_19-10-16" src="https://github.com/user-attachments/assets/9bbbdd68-333e-478e-ad17-9bc4b9c33951" />

## Features

- Upload an image from the options page
- Background persists across browser sessions

## Install

- Chrome Web Store: <https://chromewebstore.google.com/detail/background/caafjbfceobnfkhliadckecbocecaaki>
- Edge Add-ons: Coming soon!
- Firefox Add-ons: Coming soon!
- App Store: Coming soon!

## Development

```sh
pnpm i
pnpm dev
```

Load the extension from `.output/chrome-mv3-dev` in `chrome://extensions` with Developer mode enabled.

## Build

```sh
pnpm zip          # Chrome/Edge
pnpm zip:firefox  # Firefox
pnpm build:safari # Safari (macOS + Xcode required)
```

## License

GPL-3.0
