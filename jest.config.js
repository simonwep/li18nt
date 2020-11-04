module.exports = {
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    transform: {
        '\\.[jt]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '@utils/(.*)': ['<rootDir>/src/utils/$1']
    }
};
