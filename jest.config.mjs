export default {
  preset: 'ts-jest',
  collectCoverageFrom: ['server/**/*.{ts,js,jsx,mjs}', '!server/**/*.d.ts', '!server/**/*.test.ts'],
  coverageThreshold: {
    './server/middleware/setUpFrontendComponents.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['<rootDir>/(server|job)/**/?(*.)(cy|test).{ts,js,jsx,mjs}'],
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test_results/jest/',
      },
    ],
    [
      './node_modules/jest-html-reporter',
      {
        outputPath: 'test_results/unit-test-reports.html',
      },
    ],
  ],
  moduleFileExtensions: ['web.js', 'js', 'json', 'node', 'ts'],
}
