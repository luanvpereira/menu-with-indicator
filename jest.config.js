module.exports = {
	verbose: true,
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$':
			'<rootDir>/__mocks__/file-mock.js',
		'\\.(s?css)$': 'identity-obj-proxy'
	},
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
