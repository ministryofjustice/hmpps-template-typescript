import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [...hmppsConfig(), { ignores: ['experiments/**'] }]
