import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ExampleDeps } from './types'
import { exampleJourney } from './journey'
import { exampleEffectImplementations } from './effects'

export default createForgePackage<ExampleDeps>({
  journey: exampleJourney,
  functions: {
    ...exampleEffectImplementations,
  },
})
