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

## Key Technologies
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [PNPM](https://pnpm.io/)
- [Rollup](https://rollupjs.org/)
- [HTML2Canvas](https://html2canvas.hertzen.com/)
- [Color Thief](https://github.com/lokesh/color-thief)

## Inspired By
- [Extract Colors DevTool](https://github.com/guiexperttable/extract-colors-chrome-extension)
- [Site Palette](https://palette.site/)
- [ColorZilla](https://www.colorzilla.com/chrome/)