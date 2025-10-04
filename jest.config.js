module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/libs/'],
  moduleNameMapper: {
    '^@skull/core(|/.*)$': '<rootDir>/libs/core/src/$1',
    '^@app/chain(|/.*)$': '<rootDir>/libs/chain/src/$1',
    '^src(|/.*)$': '<rootDir>/src/$1',
  },
};
