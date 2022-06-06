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
  const pending = state('pending').initial()
  const resolved = state('resolved').final()
  const rejected = state('rejected').final()

  const resolve = transition('resolve')
    .connect(pending, resolved)

  const reject = transition('reject')
    .connect(pending, rejected)

  return { resolve, reject, }
}
