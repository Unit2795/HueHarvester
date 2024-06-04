import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		emptyOutDir: true
	},
    plugins: [
        react(),
        crx({
			browser: "chrome",
			manifest
		})
    ],
})
