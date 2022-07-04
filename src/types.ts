type Config<Event> = Todo

type ClassOf<S> = {new(): S}

export function transition<Payload=void>(config?: Config<Payload>) {
  return {
    to<S extends State>(s: ClassOf<S>) {
      return new Transition(config, s)
    }
  }
}

interface CondMeta<C> {
  //the original condition object
  cond: { type: string, } & C
}

export interface Action<T, P> {
  (context: T, event: P): void
}

export interface Guard<T, P, C = {}> {
  (context: T, event: P, condMeta: CondMeta<C>): boolean
}

export class Transition<Payload, NextState extends StateBase> {
  constructor(public config: Config<Payload>, public state: ClassOf<NextState>) {}

  to<S extends State>(s: ClassOf<S>): Transition<Payload, S> {
    return new Transition(this.config, s)
  }
  internal() {
    return this
  }
  when<C>(fn: Guard<any, Event, C>, meta?: C) {
    return this
  }
  action(...fn: Action<any, Event>[])  {
    return this
  }
}

const entry: unique symbol = Symbol()
const exit: unique symbol = Symbol()
const always: unique symbol = Symbol()
const wildcard: unique symbol = Symbol()
const onDone: unique symbol = Symbol()

type Todo = any

class StateBase {
  // description in visualizer or editor
  static description: string
  // user annotation for meta data
  static meta: Todo
  // annotate state with tag for editor
  static tag: string
}

export class State extends StateBase {
  [eventName: string]: Transition<any, StateBase>

  // run action when enter state
  [entry]?: Transition<unknown, this>
  // run action when exit state
  [exit]?: Transition<unknown, this>

  [always]?: Transition<void, StateBase>
  [wildcard]?: Transition<unknown, StateBase>
}


class FinalState extends StateBase {
  readonly isFinal = true
  // run action when enter state
  ;[entry]?: Transition<unknown, this>
}

// Hierarchical state
abstract class CompoundState extends StateBase {
  abstract initial: StateBase
  [onDone]?: Transition<void, StateBase>
}

// two or more child states without initial state
abstract class ParallelState extends StateBase {
  abstract states: StateBase[]
  [onDone]?: Transition<void, StateBase>
}

// represents resolving to its parent node's most recent shallow or deep history state.
abstract class HistoryState<Type extends 'deep' | 'shallow'> extends StateBase {
  abstract type: Type
}

export class Machine<S extends State> {
  constructor(s: ClassOf<S>) {}
  send<E extends (keyof S)>(e: E, payload?: S[E]['config']): Machine<InstanceType<S[E]['state']>> {
    throw new Error('todo')
  }

}
