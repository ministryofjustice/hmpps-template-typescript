import { access, Data, Format, journey, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKHeading } from '@ministryofjustice/hmpps-forge/govuk-components'
import { LoadCurrentTime, LogPageView } from './effects'
import { Page } from './types'

const exampleStep = step({
  path: '/',
  title: 'Home',
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [LogPageView(Page.EXAMPLE_PAGE), LoadCurrentTime()],
    }),
  ],
  blocks: [
    GovUKHeading({ text: 'This site is under construction...', size: 'l' }),
    GovUKBody({ text: 'Please check back later when there is content to view.' }),
    GovUKBody({
      text: Format('The time is currently %1', Data('currentTime')),
      attributes: { 'data-qa': 'timestamp' },
    }),
  ],
})

// eslint-disable-next-line import/prefer-default-export
export const exampleJourney = journey({
  code: 'example',
  title: 'HMPPS Typescript Template',
  path: '/',
  view: { template: 'partials/forge-step' },
  steps: [exampleStep],
})
