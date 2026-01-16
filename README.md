# Background

A browser extension that sets a custom background image for all websites.

## Features

- Upload an image from the options page
- Background persists across browser sessions

## Install

- Chrome Web Store: Coming soon!
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
