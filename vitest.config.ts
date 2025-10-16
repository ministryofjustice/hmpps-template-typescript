import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    reporters: [
      ['default'],
      ['junit', { outputFile: 'test_results/vitest/junit.xml' }],
      ['html', { outputFile: 'test_results/vitest/unit-test-report/index.html' }],
    ],
  },
})
