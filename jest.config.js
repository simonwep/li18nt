module.exports = {
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    transform: {
        '\\.[jt]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '@utils/(.*)': ['<rootDir>/src/app/utils/$1'],
        '@tools/(.*)': ['<rootDir>/src/app/tools/$1'],
        '@types': ['<rootDir>/src/app/types.ts']
    }
};
