interface StateRef {
}
interface State<T> extends StateRef {
  description(desc: string): this
  // run action when enter state
  entry(action: Action<T, unknown>): this
  // run action when exit state
  exit(action: Action<T, unknown>): this
  // user annotation for meta data
  meta(data: unknown): this
  // annotate state with tag for editor
  tag(tagName: string): this

  // Hierarchical state
  compound(func: CreateMachine): CompoundState<T>
  // two or more child states without initial stat
  parallel<Children extends State<unknown>[]>(...children: Children): ParallelState
  // represents resolving to its parent node's most recent shallow or deep history state.
  history(type: 'deep' | 'shallow'): HistoryState
  // final state
  final(): StateRef
}

interface CompoundState<T> extends StateRef {
  onDone(): StateRef
}

interface ParallelState extends StateRef {
  onDone<T>(state: State<T>): this
  // mutlipleTarget
}

interface HistoryState extends StateRef {
  target(s: StateRef): StateRef
}

interface CondMeta<C> {
  //the original condition object
  cond: {type: string,} & C
}

interface Guard<T, P, C={}> {
  (context: T, event: P, condMeta: CondMeta<C>): boolean
}
interface Action<T, P> {
  (context: T, event: P): void
}

interface TransitionFrom<T, P> {
  from(s: StateRef): TransitionTo<T, P>
}
interface TransitionTo<T, P> {
  to(s: StateRef): Transition<T, P>
}

interface Transition<T, P> {
  // A self-transition is when a state transitions to itself, in which it may exit and then reenter itself.
  // Self-transitions can either be an internal or external transition:
  // An internal transition will neither exit nor re-enter itself, but may enter different child states.
  // An external transition will exit and re-enter itself, and may also exit/enter child states.
  internal(): this
  guard<C>(fn: Guard<T, P, C>, meta?: C): this
  action(...fn: Action<T, P>[]): this
  from(s: StateRef): TransitionTo<T, P>
}

export class MachineConfig<T> {
  state(name?: string): State<T> {
    throw new Error('to do!')
  }
  transition<P>(name?: string): Transition<T, P> {
    throw new Error('to do!')
  }
  // Eventless transition
  // Will transition to another immediately upon entry
  always(): Transition<T, never> {
    throw new Error('to do!')
  }
  wildcard(): Transition<T, unknown> {
    throw new Error('to do!')
  }
}

export interface CreateMachine {
  <T>(initialState?: {
    id?: string,
    initialContext?: T
  }): MachineConfig<T>
}

