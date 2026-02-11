/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '^router-core$': '<rootDir>/../../packages/router-core/src/index.ts',
  },
};
