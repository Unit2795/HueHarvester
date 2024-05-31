import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/popup.js', // Your main script file
	output: {
		file: 'dist/bundle.js', // Output bundle file
		format: 'iife', // Immediately Invoked Function Expression format
		name: 'HueHarvester'
	},
	plugins: [
		resolve(), // Teaches Rollup how to find external modules in node_modules
		commonjs() // Converts CommonJS modules to ES modules
	]
};
