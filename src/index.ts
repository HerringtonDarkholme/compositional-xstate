interface State<T> {
  // final state
  final(): this
  description: string
  // Hierarchical state
  compound<I>(config: Config<I>): this
  // run action when enter state
  entry(action: Action<T, unknown>): this
  // run action when exit state
  exit(action: Action<T, unknown>): this
  // Eventless transition
  // Will transition to either 'win' or 'lose' immediately upon
  always(conf: Todo): this
  // user annotation for meta data
  meta(data: unknown): this
  // annotate state with tag for editor
  tag(tagName: string): this
}

interface Guard<T, P> {
  (context: T, event: P): boolean
}
interface Action<T, P> {
  (context: T, event: P): void
}

interface Transition<T, P> {
  from(s: State<T>): this
  to(s: State<T>): this
  guard(fn: Guard<T, P>): this
  action(fn: Action<T, P>): this
}

type Todo = any

export function state(name?: string): State<Todo> {
  throw new Error('to do!')
}

export function transition(): Transition<Todo, Todo> {
  throw new Error('to do!')
}

type Dict<T> = Record<string | symbol, T>

interface Config<T> {
  context?: T
  states?: Dict<State<T>>
  transitions?: Dict<Transition<T, unknown>>
}

export function createStateMachine<T>(machine: Config<T>) {}
