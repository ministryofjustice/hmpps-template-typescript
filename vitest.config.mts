import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['{server,job}/**/*.{cy,test}.{ts,js,mjs}'],
    reporters: [
      'default',
      // Path retained so the shared hmpps-github-actions unit test workflow continues to find the JUnit output
      ['junit', { outputFile: 'test_results/jest/results.xml' }],
      ['html', { outputDir: 'test_results/unit-test-reports', singleFile: true }],
    ],
    coverage: {
      provider: 'v8',
      include: ['server/**/*.{ts,js,mjs}'],
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: 'test_results/coverage',
    },
  },
})
