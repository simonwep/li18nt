module.exports = {
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    transform: {
        '\\.[jt]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '@utils/(.*)': ['<rootDir>/src/utils/$1'],
        '@tools/(.*)': ['<rootDir>/src/app/tools/$1'],
        '@types': ['<rootDir>/src/types.ts'],
    }
};
