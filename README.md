# HueHarvester

HueHarvester is a Google Chrome extension that extracts color palettes from webpages using CSS and image analysis.

## Directory Structure
- `dist/` - Contains the built extension script files produced by Rollup
- `images/` - Icons and images used in the extension
- `lib/` - Third-party libraries
  - `color-thief.umd.js` - Color Thief library for extracting colors from images (Median Cut Algorithm)
  - `html2canvas.min.js` - HTML2Canvas library for rendering the current webpage as an image
- `scripts/` - Javascript source files
  - `canvas.js` - Uses HTML2Canvas to turn the current webpage into a base64 image and returns the image data
  - `popup.js` - Primary logic responsible for executing the content scripts, and displaying the extracted colors in the extension's popup window
- `manifest.json` - Google Chrome extension configuration file
- `popup.css` - CSS file for the extension's popup window
- `popup.html` - HTML file for the extension's popup window
- `rollup.config.mjs` - Rollup configuration file

## Development

### Hot-Reload
We use CRXJS to allow for hot-reloading of the extension. Once you start the development server and load the unpacked `/dist`folder in the Chrome Extensions page, you'll need to reload the extension to load the service worker, then the extension will automatically reload when you make changes to the source code until you stop the development server. When you start it again you'll just need to click the reload button again. 

## Key Technologies
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (Programming Language)
- [TypeScript](https://www.typescriptlang.org/) (Type-Safe Superset of JavaScript)
- [Vite](https://vitejs.dev/) (Development Server)
- [React](https://reactjs.org/) (UI Library)
- [Tailwind CSS](https://tailwindcss.com/) (Utility-First CSS Framework)
- [ESLint](https://eslint.org/) (Code Linter)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/) (Extension Development)
- [PNPM](https://pnpm.io/) (Package Management)
- [Rollup](https://rollupjs.org/) (Bundling)
- [HTML2Canvas](https://html2canvas.hertzen.com/) (Rendering Webpages as Images)
- [Color Thief](https://github.com/lokesh/color-thief) (Median Cut Algorithm)
- [CRXJS](https://crxjs.dev/vite-plugin) (Vite Plugin for Hot-Reloading Chrome Extensions)

## Inspired By
- [Extract Colors DevTool](https://github.com/guiexperttable/extract-colors-chrome-extension)
- [Site Palette](https://palette.site/)
- [ColorZilla](https://www.colorzilla.com/chrome/)