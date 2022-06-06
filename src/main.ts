import { inspect } from '@xstate/inspect';
import { interpretMachine, CreateMachine } from './index'
import './styles/main.css'

inspect({
  // options
  iframe: document.getElementsByTagName('iframe')[0] // open in new window
});

function defineMachine(c: CreateMachine) {
  const { state, transition } = c({
    id: 'promise',
  })
  const pending = state('pending').initial()
  const resolved = state('resolved').final()
  const rejected = state('rejected').final()

  const resolve = transition('resolve').connect(pending, resolved)

  const reject = transition('reject')
    .connect(pending, rejected)

  return { resolve, reject }

}


document.getElementById('app')!.textContent = defineMachine.toString()

const machine = interpretMachine(defineMachine)

machine.send('resolve').state
machine.send('reject').state

const trafficList = interpretMachine(c => {
  const { state, transition } = c({})
  const green = state('green').initial()
  const yellow = state('yellow')
  const red = state('red')

  const time = transition('time')
    .connect(green, yellow)
    .connect(yellow, red)
  // .connect(red, green)
  return { time }
})

trafficList.send('time').state
