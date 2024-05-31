import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	{
		input: 'scripts/popup.js', // Your main script file
		output: {
			file: 'dist/popup.js', // Output bundle file
			format: 'iife', // Immediately Invoked Function Expression format
		},
		plugins: [
			resolve(), // Teaches Rollup how to find external modules in node_modules
			commonjs() // Converts CommonJS modules to ES modules
		]
	},
	{
		input: 'scripts/canvas.js', // Your main script file
		output: {
			file: 'dist/canvas.js', // Output bundle file
			format: 'iife', // Immediately Invoked Function Expression format
		},
		plugins: [
			resolve(), // Teaches Rollup how to find external modules in node_modules
			commonjs() // Converts CommonJS modules to ES modules
		]
	}
];
