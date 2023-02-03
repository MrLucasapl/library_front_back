// eslint-disable-next-line no-undef
module.exports = {
	testEnvironment: 'jest-environment-node',
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
		'^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	moduleNameMapper: {
		'^src/(.*)': '<rootDir>/src/$1',
		'\\.(gif|ttf|eot|svg|png)$': '<rootDir>./fileMock.js',
		'\\.(css|less|sass|scss)$': 'identity-obj-proxy',
	},
};