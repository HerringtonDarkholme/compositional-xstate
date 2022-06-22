class Transition<Event, NextState> {

}

const a: unique symbol = Symbol()

class Test {
  [a] = 123
}
var bb = new Test

type T = (typeof bb) extends {[K in typeof a]: infer b } ? b : never


type Todo = any

class State {
  // description in visualizer or editor
  static description: string
  // user annotation for meta data
  static meta: Todo
  // annotate state with tag for editor
  static tag: string

}
class Atomic extends State {
  [eventName: string]: Transition<any, State> | void

  // run action when enter state
  entry?: Transition<unknown, this>
  // run action when exit state
  exit?: Transition<unknown, this>

  always?: Transition<void, State>
  wildcard?: Transition<unknown, State>
}


class FinalState extends State {
  readonly isFinal = true
  // run action when enter state
  entry?: Transition<unknown, this>
}

// Hierarchical state
abstract class CompoundState extends State {
  abstract initial: State
  onDone?: Transition<void, State>
}

// two or more child states without initial state
abstract class ParallelState extends State {
  abstract states: State[]
  onDone?: Transition<void, State>
}

// represents resolving to its parent node's most recent shallow or deep history state.
abstract class HistoryState<Type extends 'deep' | 'shallow'> extends State {
  abstract type: Type
}
