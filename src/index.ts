import { interpret, createMachine, MachineConfig as OriginalConfig } from 'xstate';
import type {
  State, Action, Guard,
  CompoundState, MachineDefine, ParallelState,
  StateRef, Transition,
  CreateMachine, MachineConfig, HistoryState,
  ExtractMachine, Trans,
} from './types'
export type { CreateMachine } from './types'

type XStateConfig = OriginalConfig<any, any, any>

class StateImpl<N, T> implements State<N, T> {
  constructor(public name: N, private config: any) { }
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
  compound<R extends Trans>(_define: MachineDefine<R>): CompoundState<N, T, R> {
    throw new Error('todo')
  }
  // two or more child states without initial stat
  parallel<Children extends State<string, unknown>[]>(..._children: Children): ParallelState<N> {
    throw new Error('todo')
  }
  // represents resolving to its parent node's most recent shallow or deep history state.
  history(type: 'deep' | 'shallow'): HistoryState<N> {
    throw new Error('todo')
  }
  // final state
  final(): StateRef<N> {
    this.config.final = true
    return this
  }
  initial() {
    this.config.initial = true
    return this as any
  }

  onDone(action: Action<T, unknown>) {
    this.config.onDone = { action }
    return this
  }
}


class TransitionImpl<N extends string, T, P, S = never> implements Transition<N, T, P, S> {
  on: any = {}
  statePhantomType: S = null as any
  constructor(public name: N, public states: Record<string, any>) { }
  connect<U extends string, V extends string>(from: StateRef<U>, to: StateRef<V>): Transition<N, T, P, S & Record<U, V>> {
    this.states[from.name].on ??= {}
    this.states[from.name].on[this.name] ??= []
    this.on = {
      target: to.name
    }
    this.states[from.name].on[this.name].push(this.on)
    return this as any
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
}

export class MachineConfigImpl<T> implements MachineConfig<T> {
  config: any
  constructor(config: any) {
    this.config = config
  }
  state<N extends string>(stateName: N): State<N, T> {
    this.config.states = this.config.states || {}
    this.config.states[stateName] = {}
    return new StateImpl(stateName, this.config.states[stateName])
  }
  transition<N extends string, P>(transitionName: N): Transition<N, T, P> {
    return new TransitionImpl(transitionName, this.config.states)
  }
  // Eventless transition
  // Will transition to another immediately upon entry
  always(): Transition<'', T, never> {
    throw new Error('TODO!')
  }
  wildcard(): Transition<'*', T, unknown> {
    throw new Error('TODO!')
  }
}

function initializer(): [XStateConfig, CreateMachine] {
  const config: XStateConfig = {}
  return [config, (initializer) => new MachineConfigImpl(config)]
}

export function interpretMachine<T extends Trans>(define: MachineDefine<T>): ExtractMachine<T> {
  const [config, cm] = initializer()
  config.initial = define(cm).initial.name
  const machine = createMachine(config)
  return interpret(machine, { devTools: true }) as any // TODO
}
