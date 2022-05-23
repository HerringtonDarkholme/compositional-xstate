import {state, createStateMachine, transition} from '../index'


/*
const promiseMachine = createMachine({
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {
      on: {
        RESOLVE: { target: 'resolved' },
        REJECT: { target: 'rejected' }
      }
    },
    resolved: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
});
*/

const pending = state()
const resolved = state().final()
const rejected = state().final()

const resolve = transition()
  .from(pending)
  .to(resolved)

const reject = transition()
  .from(pending)
  .to(rejected)

const promiseMachine = createStateMachine({
  states: {pending, resolved, rejected},
  transitions: {resolve, reject},
})
