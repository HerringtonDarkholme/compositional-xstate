import { interpret, createMachine, MachineConfig as OriginalConfig } from 'xstate';
import type {
  State, Action, Guard,
  CompoundState, MachineDefine, ParallelState,
  StateRef, TransitionFrom, TransitionTo, Transition,
  CreateMachine, MachineConfig, HistoryState,
} from './types'
export type {CreateMachine} from './types'

type XStateConfig = OriginalConfig<any, any, any>

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
    this.config.initial = config.initial
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

export class MachineConfigImpl<T> implements MachineConfig<T> {
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

function initializer(): [XStateConfig, CreateMachine] {
  const config: XStateConfig = {}
  return [config, (initializer) => new MachineConfigImpl(config)]
}


export function inspectMachine(define: MachineDefine) {
  const [config, cm] = initializer()
  config.initial = define(cm).name
  console.log(config)
  const machine = createMachine(config)
  const service = interpret(machine, { devTools: true });
  service.start();
}
