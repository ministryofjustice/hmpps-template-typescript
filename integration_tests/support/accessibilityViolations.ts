import { Result } from 'axe-core'

export default {
  logAccessibilityViolationsSummary: (message: string): null => {
    // eslint-disable-next-line no-console
    console.log(message)

    return null
  },
  logAccessibilityViolationsTable: (violations: Result[]): null => {
    // eslint-disable-next-line no-console
    console.table(violations)

    return null
  },
}
