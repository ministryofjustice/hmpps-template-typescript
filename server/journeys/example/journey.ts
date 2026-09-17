import {
  access,
  Condition,
  Data,
  Format,
  journey,
  redirect,
  Self,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKButton, GovUKHeading, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { LoadCurrentTime, LogPageView, LogSearch } from './effects'
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
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [LogSearch()],
        next: [redirect({ goto: '/' })],
      },
    }),
  ],
  blocks: [
    GovUKHeading({ text: 'This site is under construction...', size: 'l' }),
    GovUKBody({ text: 'Please check back later when there is content to view.' }),
    GovUKBody({
      text: Format('The time is currently %1', Data('currentTime')),
      attributes: { 'data-qa': 'timestamp' },
    }),
    GovUKTextInput({
      code: 'searchTerm',
      label: 'Search term',
      hint: 'This example records an audit event; it does not return search results.',
      validWhen: [validation({ condition: Self().match(Condition.IsRequired()), message: 'Enter a search term' })],
    }),
    GovUKButton({ text: 'Search' }),
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
