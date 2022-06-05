import { CreateMachine } from '../index';
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



function promiseMachine(c: CreateMachine) {
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
