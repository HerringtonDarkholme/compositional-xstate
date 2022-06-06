export interface StateRef<Name> {
  name: Name
}
export interface State<N, T> extends StateRef<N> {
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
  compound<R extends Trans>(define: MachineDefine<R>): CompoundState<N, T, R>
  // two or more child states without initial stat
  parallel<Children extends State<string, unknown>[]>(...children: Children): ParallelState<N>
  // represents resolving to its parent node's most recent shallow or deep history state.
  history(type: 'deep' | 'shallow'): HistoryState<N>
  // final state
  final(): StateRef<N>
  initial(): StateRef<N> & { isInitia: true }
}

export interface CompoundState<N, T, R> extends StateRef<N> {
  onDone(action: Action<T, unknown>): this
  readonly subTransitions: R,
}

export interface ParallelState<N> extends StateRef<N> {
  onDone<M>(state: StateRef<M>): this
  // mutlipleTarget
}

export interface HistoryState<N> extends StateRef<N> {
  target<M>(s: StateRef<M>): StateRef<M>
}

interface CondMeta<C> {
  //the original condition object
  cond: { type: string, } & C
}

export interface Guard<T, P, C = {}> {
  (context: T, event: P, condMeta: CondMeta<C>): boolean
}
export interface Action<T, P> {
  (context: T, event: P): void
}

export interface Transition<Name extends string, T, P = unknown, States = {}> {
  // A self-transition is when a state transitions to itself, in which it may exit and then reenter itself.
  // Self-transitions can either be an internal or external transition:
  // An internal transition will neither exit nor re-enter itself, but may enter different child states.
  // An external transition will exit and re-enter itself, and may also exit/enter child states.
  internal(): this
  guard<C>(fn: Guard<T, P, C>, meta?: C): this
  action(...fn: Action<T, P>[]): this
  connect<M extends string, N extends string>(from: StateRef<M>, to: StateRef<N>): Transition<Name, T, P, States & Record<M, N>>
  readonly statePhantomType: States
  readonly name: Name
}

interface Initializer<T> {
  id?: string,
  initialContext?: T
}

export interface MachineConfig<T> {
  // declare state
  state<N extends string>(n: N): State<N, T>
  // declare transitions
  transition<N extends string, P>(n: N): Transition<N, T, P>
  // Eventless transition, State will transition to another immediately upon entry
  always(): Transition<'', T, {}>
  // Wildcard transtion catches all other events not handled
  wildcard(): Transition<'*', T, unknown>
}

export interface CreateMachine {
  <T>(initializer?: Initializer<T>): MachineConfig<T>
}

export type Trans = Record<string, Transition<string, unknown, unknown>>

export type MachineDefine<T extends Trans> = (c: CreateMachine) => T

export type ExtractMachine<T extends Trans> =
  Machine<Transpose<ExtractTransition<T>>>

type Machine<Table, S = keyof Table> = {
  state: S,
} & (
    S extends keyof Table ? {
      send<E extends keyof Table[S]>(event: E): Machine<Table, Table[S][E]>
    } : {})


type ExtractTransition<T extends Trans> = {
  [K in keyof T]: T[K]['statePhantomType']
}


type UnionToIntersection<T> =
  (T extends any ? (x: T) => any : {}) extends
  (x: infer R) => any ? R : {}

type Transpose<Table> =
  UnionToIntersection<TransposeAux<keyof Table, Table>>

type TransposeAux<Key extends keyof Table, Table> =
  Key extends string ? TransposeOne<Key, Table[Key]> : never

type TransposeOne<EventName extends string, StateMaps> = {
  [From in keyof StateMaps]: Record<EventName, StateMaps[From]>
}
