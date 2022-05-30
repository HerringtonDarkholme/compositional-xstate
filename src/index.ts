import { interpret, createMachine, MachineConfig as MachineConfigImpl } from 'xstate';
type XStateConfig = MachineConfigImpl<any, any, any>
interface StateRef {
  name: string
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
  compound(define: MachineDefine): CompoundState<T>
  // two or more child states without initial stat
  parallel<Children extends State<unknown>[]>(...children: Children): ParallelState
  // represents resolving to its parent node's most recent shallow or deep history state.
  history(type: 'deep' | 'shallow'): HistoryState
  // final state
  final(): StateRef
}

class StateImpl<T> implements State<T> {
  constructor(public name: string, private config: any) {}
  description(desc: string) {
    this.config.description = desc
    return this
  }
  entry(action: Action<T, unknown>): this {
    this.config.entry ??= []
    this.config.entry.push(action)
    return this
  }
  exit(action: Action<T, unknown>): this {
    this.config.exit ??= []
    this.config.exit.push(action)
    return this
  }
  meta(data: unknown): this {
    this.config.meta = data
    return this
  }
  tag(name: string) {
    this.config.tags = this.config.tags ?? []
    this.config.tags.push(name)
    return this
  }

  // Hierarchical state
  compound(define: MachineDefine): CompoundState<T> {
    const [config, cm] = initializer()
    config.initial = define(cm).name
    this.config.states = config.states
    return this
  }
  // two or more child states without initial stat
  parallel<Children extends State<unknown>[]>(...children: Children): ParallelState {
    throw new Error('todo')
  }
  // represents resolving to its parent node's most recent shallow or deep history state.
  history(type: 'deep' | 'shallow'): HistoryState {
    throw new Error('todo')
  }
  // final state
  final(): StateRef {
    this.config.final = true
    return this
  }

  onDone(action: Action<T, unknown>) {
    this.config.onDone = {action}
    return this
  }
}

interface CompoundState<T> extends StateRef {
  onDone(action: Action<T, unknown>): this
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

class TransitionFromImpl<T, P> implements TransitionFrom<T, P> {
  constructor(public name: string, public states: Record<string, any>) {}
  from(s: StateRef): TransitionTo<T, P> {
    this.states[s.name].on ??= {}
    this.states[s.name].on[this.name] ??= []
    const on = {}
    this.states[s.name].on[this.name].push(on)
    return new TransitionImpl(on, this)
  }
}

class TransitionImpl<T, P> implements TransitionTo<T, P>, Transition<T, P> {
  constructor(private on: Record<string, any>, private parent: TransitionFromImpl<T, P>) {}
  to(s: StateRef): Transition<T, P> {
    this.on.target = s.name
    return this
  }
  internal() {
    this.on.internal = true
    return this
  }
  guard<C>(fn: Guard<T, P, C>, meta?: C) {
    this.on.cond ??= []
    this.on.cond.push({
      type: fn,
      ...meta,
    })
    return this
  }
  action(...fn: Action<T, P>[]) {
    this.on.actions ??= []
    this.on.actions.push(fn)
    return this
  }
  from(s: StateRef): TransitionTo<T, P> {
    return this.parent.from(s)
  }
}

export class MachineConfig<T> {
  config: any
  constructor(config: any) {
    this.config = config
  }
  state(name: string): State<T> {
    this.config.states = this.config.states || {}
    this.config.states[name] = { }
    return new StateImpl(name, this.config.states[name])
  }
  transition<P>(name: string): TransitionFrom<T, P> {
    return new TransitionFromImpl(name, this.config.states)
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
  <T>(initializer?: Initializer<T>): MachineConfig<T>
}

interface Initializer<T> {
    id?: string,
    initialContext?: T
}

function initializer(): [XStateConfig, CreateMachine] {
  const config: XStateConfig = {}
  return [config, (initializer) => new MachineConfig(config)]
}

export type MachineDefine = (c: CreateMachine) => StateRef

export function inspectMachine(define: MachineDefine) {
  const [config, cm] = initializer()
  config.initial = define(cm).name
  console.log(config)
  const machine = createMachine(config)
  const service = interpret(machine, { devTools: true });
  service.start();
}
