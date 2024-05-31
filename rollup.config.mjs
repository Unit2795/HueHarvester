import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	{
		input: 'src/popup.js', // Your main script file
		output: {
			file: 'dist/popup.js', // Output bundle file
			format: 'iife', // Immediately Invoked Function Expression format
			name: 'HueHarvesterPopup'
		},
		plugins: [
			resolve(), // Teaches Rollup how to find external modules in node_modules
			commonjs() // Converts CommonJS modules to ES modules
		]
	},
	{
		input: 'src/content.js', // Your main script file
		output: {
			file: 'dist/content.js', // Output bundle file
			format: 'cjs', // Immediately Invoked Function Expression format
			name: 'HueHarvesterContent'
		},
		plugins: [
			resolve(), // Teaches Rollup how to find external modules in node_modules
			commonjs() // Converts CommonJS modules to ES modules
		]
	}
];
