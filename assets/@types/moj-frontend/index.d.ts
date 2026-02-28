/**
 * MoJ Frontend types based on v8.0.1
 * https://github.com/ministryofjustice/moj-frontend
 *
 * NB: this was recreated manually from javascript sources and may be incomplete!
 */

// eslint-disable-next-line max-classes-per-file
declare module '@ministryofjustice/frontend' {
  import type { Component, ConfigurableComponent, CreateAllOptions } from 'govuk-frontend'

  export function initAll(scopeOrConfig?: CreateAllOptions): void

  export class AddAnother extends Component {}
  export class Alert extends ConfigurableComponent {}
  export class ButtonMenu extends ConfigurableComponent {}
  export class DatePicker extends ConfigurableComponent {}
  export class MultiSelect extends ConfigurableComponent {}
  export class PasswordReveal extends Component {}
  export class PdsHeader extends Component {}
  export class RichTextEditor extends ConfigurableComponent {}
  export class SearchToggle extends ConfigurableComponent {}
  export class SortableTable extends ConfigurableComponent {}

  // these components don’t seem to get initialised by initAll
  export class FilterToggleButton extends ConfigurableComponent {}
  export class FormValidator extends ConfigurableComponent {}
  export class MultiFileUpload extends ConfigurableComponent {}

  export const version: string
}
