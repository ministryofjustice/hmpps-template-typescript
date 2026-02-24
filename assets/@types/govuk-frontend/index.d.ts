/**
 * GOV.UK Frontend types based on v5.14.0
 * https://github.com/alphagov/govuk-frontend
 *
 * NB: this was recreated manually from javascript sources and may be incomplete!
 */

// eslint-disable-next-line max-classes-per-file
declare module 'govuk-frontend' {
  export abstract class Component<RootElement extends HTMLElement = HTMLElement> {
    static checkSupport(): void

    static moduleName: string

    // technically `typeof RootElement`, but static properties cannot refer to generic parameters
    static elementType: typeof HTMLElement

    constructor($root: RootElement)

    /** Returns the root element of the component */
    get $root(): RootElement

    checkInitialised(): void
  }

  const configOverride: unique symbol

  interface SchemaProperty {
    type: 'string' | 'boolean' | 'number' | 'object'
  }

  interface Schema {
    properties: Record<string, SchemaProperty | undefined>
    anyOf?: { required: string[]; errorMessage: string }[]
  }

  type ObjectNested = {
    [key: string]: string | boolean | number | ObjectNested | undefined
  }

  export abstract class ConfigurableComponent<
    RootElement extends HTMLElement = HTMLElement,
    Config = Record<string, string | boolean | number>,
  > extends Component<RootElement> {
    // technically types of `schema` and `defaults` should be strongly tied to `Config`,
    // but static properties cannot refer to generic parameters
    static schema: Schema

    static defaults: ObjectNested

    constructor($root: RootElement, config: Config)

    [configOverride](datasetConfig: Partial<Config>): object

    get config(): Config
  }

  export class Accordion extends ConfigurableComponent {}
  export class Button extends ConfigurableComponent {}
  export class CharacterCount extends ConfigurableComponent {}
  export class Checkboxes extends Component {}
  export class ErrorSummary extends ConfigurableComponent {}
  export class ExitThisPage extends ConfigurableComponent {}
  export class FileUpload extends ConfigurableComponent {}
  export class Header extends Component {}
  export class NotificationBanner extends ConfigurableComponent {}
  export class PasswordInput extends ConfigurableComponent {}
  export class Radios extends Component {}
  export class ServiceNavigation extends Component {}
  export class SkipLink extends Component<HTMLAnchorElement> {}
  export class Tabs extends Component {}

  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * Some browsers will load and run our JavaScript but GOV.UK Frontend
   * won't be supported.
   */
  export function isSupported(scope?: HTMLElement): boolean

  interface ErrorContext {
    config: Record<string, string | boolean | number>
    component?: Component
    element?: HTMLElement
  }

  interface ErrorCallback {
    onError: (error: Error, context: ErrorContext) => void
  }

  interface InitAllOptions {
    scope?: HTMLElement | Document
    onError?: ErrorCallback
  }

  /**
   * Initialise all components
   *
   * Use the `data-module` attributes to find, instantiate and init all of the
   * components provided as part of GOV.UK Frontend.
   */
  export function initAll(config?: InitAllOptions): void

  type CreateAllOptions = InitAllOptions | HTMLElement | Document | ErrorCallback

  /**
   * Create all instances of a specific component on the page
   *
   * Uses the `data-module` attribute to find all elements matching the specified
   * component on the page, creating instances of the component object for each
   * of them.
   *
   * Any component errors will be caught and logged to the console.
   */
  export function createAll<
    E extends HTMLElement,
    C extends Component<E>,
    Class extends { new (element: never, config: never): C },
  >(component: Class, config?: ConstructorParameters<Class>[1]): void

  export const version: string
}
