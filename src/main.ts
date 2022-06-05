import { inspect } from '@xstate/inspect';
import {inspectMachine, CreateMachine} from './index'

inspect({
  // options
  iframe: document.getElementsByTagName('iframe')[0] // open in new window
});

function defineMachine(c: CreateMachine) {
  const {state, transition} = c({
    id: 'promise',
  })
  const pending = state()
  const resolved = state().final()
  const rejected = state().final()

  const resolve = transition()
    .from(pending).to(resolved)

  const reject = transition()
    .from(pending).to(rejected)

  return {
    initial: pending,
    states: {pending, resolved, rejected},
    transition: {resolve, reject},
  }
}


document.getElementById('app')!.textContent = defineMachine.toString()

inspectMachine(defineMachine)
