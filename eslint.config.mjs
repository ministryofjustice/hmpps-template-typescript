import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'
import html from '@html-eslint/eslint-plugin'
// eslint-disable-next-line import/default
import htmlParser, { TEMPLATE_ENGINE_SYNTAX } from '@html-eslint/parser'

export default [
  ...hmppsConfig(),
  {
    name: 'prettier-overrides',
    rules: {
      'prettier/prettier': [
        'warn',
        {
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          semi: false,
          arrowParens: 'avoid',
        },
      ],
    },
  },
  // Disable prettier for .njk files
  {
    name: 'disable-prettier-for-njk',
    files: ['**/*.njk'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
  {
    files: ['**/*.njk'],
    plugins: { html },
    languageOptions: {
      parser: htmlParser,
      parserOptions: {
        templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
      },
    },
    rules: {
      ...html.configs.recommended.rules,
      'html/attrs-newline': 'off',
      'html/indent': ['warn', 2],
    },
  },
]
