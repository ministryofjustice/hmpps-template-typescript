import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ExampleDeps } from './types'
import { exampleJourney } from './journey'

export default createForgePackage<ExampleDeps>({
  journey: exampleJourney,
})
