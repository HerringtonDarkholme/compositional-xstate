interface State<T> {
  description: string
  // run action when enter state
  entry(action: Action<T, unknown>): this
  // run action when exit state
  exit(action: Action<T, unknown>): this
  // user annotation for meta data
  meta(data: unknown): this
  // annotate state with tag for editor
  tag(tagName: string): this

  // Hierarchical state
  compound<I>(config: Config<I>): this & {onDone(): State<T>}
  // two or more child states without initial stat
  parallel<Children extends State<unknown>[]>(...children: Children): this & ParallelStateNode
  // represents resolving to its parent node's most recent shallow or deep history state.
  history(type: 'deep' | 'shallow'): this
  // final state
  final(): this
}

interface ParallelStateNode {
  onDone<T>(state: State<T>): this
  // mutlipleTarget
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
  // A self-transition is when a state transitions to itself, in which it may exit and then reenter itself.
  // Self-transitions can either be an internal or external transition:
  // An internal transition will neither exit nor re-enter itself, but may enter different child states.
  // An external transition will exit and re-enter itself, and may also exit/enter child states.
  internal(): this
  guard(fn: Guard<T, P>): this
  action(fn: Action<T, P>): this
}

interface SpecialTransition {
  wildcard<T>(): Transition<T, unknown>
  // Eventless transition
  // Will transition to either 'win' or 'lose' immediately upon
  always(conf: Todo): this
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
