import { inspect } from '@xstate/inspect';
import { ExtractTransition, Transpose } from 'types';
import { interpretMachine, CreateMachine } from './index'
import './styles/main.css'

inspect({
  // options
  iframe: document.getElementsByTagName('iframe')[0] // open in new window
});

function defineMachine(c: CreateMachine) {
  const {state, transition} = c({
    id: 'promise',
  })
  const pending = state('pending').initial()
  const resolved = state('resolved').final()
  const rejected = state('rejected').final()

  const resolve = transition()
    .connect(pending, resolved)

  const reject = transition()
    .connect(pending, resolved)

  return {resolve, reject}

}


document.getElementById('app')!.textContent = defineMachine.toString()

const machine = interpretMachine(defineMachine)

type Ret = ReturnType<typeof defineMachine>
type TransitionTable = Transpose<ExtractTransition<Ret>>
declare var a: TransitionTable

machine.send('resolve')
