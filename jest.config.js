module.exports = {
	verbose: true,
	setupFiles: ['./test-utils/enzyme-setup.js'],
	coveragePathIgnorePatterns: ['public', 'test-utils', './src/App.js'],
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	}
};
